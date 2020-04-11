# JAVA SDK 使用说明
## 1. 平台支持

JAVA SDK 在设计过程中，充分考虑了跨平台的需求。本 SDK 可以支持 windows/linux/android 操作系统，同时支持网络与串口通讯。而且在不同平台下，所有的操作都拥有统一的接口。

## 2. 获取 SDK

a. windows/linux demo: 

https://doc.onbonbx.com/

b. android demo: 

https://doc.onbonbx.com/

## 3. 使用说明

对于五代和六代控制器，我们提供了不同的 JAR 包，而其接口定义遵循了相同的命名规则，五代控制器的接口通常命名为 Bx5Gxxxx, 而相对应的六代控制器通常命名为 Bx6Gxxx。而以下接口说明中，为了简便只提到了五代SDK的接口，而六代SDK的接口，可根据命名规则自行推断或查看SDK中附带的相应的 JAVADOC 文档。

### 3.1 SDK初始化

在使用 SDK 之前，必需先对整个 SDK 进行初始化。而初始化操作，在整个应用中只能进行一次（**注: 非常重要**)。如果反复调用 initial() 接口，会导致系统的 cpu load 变高。其调用方法如下：

**五代控制器**

```java 
// 五代控制器
// 初始化SDK
// 初始化有3种方法，如下
Bx5GEnv.initial();
// log.properties是日志配置文件
Bx5GEnv.initial("log.properties"); 
// 30000为通讯超时时间，单位是毫秒
Bx6GEnv.initial("log.properties",30000);
```
**六代控制器**

```java
// 六代控制卡
// 初始化SDK
// 初始化有3种方法，如下
Bx6GEnv.initial();
// log.properties是日志配置文件
Bx6GEnv.initial("log.properties");
// 30000为通讯超时时间，单位是毫秒
Bx6GEnv.initial("log.properties",30000);
```
### 3.2 Screen类

要SDK中与控制器的所有交互都需要通过Bx5GScreen类或其子类来进行，其子类包括：
Bx5GScreenClient（client模式使用），Bx5GScreenRS（串口模式使用），Bx5GScreenServer（server模式使用）。创建screen对象的通常代码如下：

**五代控制器**
```java 
// 五代控制器
// 创建screen对象，用于对控制器进行访问，客户端模式
Bx5GScreenClient screen = new Bx5GScreenClient("MyScreen");
// 创建screen对象，用于对控制器进行访问，串口模式
Bx5GScreenRS screen = new Bx5GScreenRS("MyScreen");
```
**六代控制器**

```java
// 六代控制器创建screen对象方法，以BX-6M系列为例
// Bx6M 为控制卡型号，只有型号对应才能通讯正常，否则会出现逾时未回应
// 如果使用的控制器型号在SDK中没有定义，则用Bx6M替代
// 创建screen对象，用于对控制器进行访问，客户端模式
Bx6GScreenClient screen = new Bx6GScreenClient("MyScreen",new Bx6M());
// 创建screen对象，用于对控制器进行访问，串口模式
Bx6GScreenRS screen = new Bx6GScreenRS("MyScreen",new Bx6M());
```
### 3.3 屏幕连接
在对控制器交互之前，需要先与控制器建立连接，代码如下：
```java
// 连接控制器
// 其中，192.168.100.199为控制器的实际IP地址，请根据实际情况填写
// 端口号默认为5005
// 五代控制器和六代控制器屏幕连接方法一样
screen.connect("192.168.100.199",5005);
```
与控制器交互完成后，需断开与控制器之间的连接，其代码如下：
```java
// 断开与控制器之间的连接
screen.disconnect();
```
**注1：connect 与 disconnect 必需成对出现，通讯结束时一定要记得断开连接**

**注2：如果不知道控制器IP地址，请先使用LedshowTW软件设置IP地址，软件下载地址：https://www.onbonbx.com/download/165.html**

### 3.4 屏幕控制

SDK 还提供了一些接口，用于对 屏幕进行一些常用操作。

#### 3.4.1 开关机

```java
// 关机
screen.turnOff();
// 开机
screen.turnOn();
```

#### 3.4.2 校正时钟

控制器上的时钟不准确时，可以通过此命令对其进行校正。

```java
// 校时
screen.syncTime();
```

#### 3.4.3 锁定屏幕

```java
// 锁定屏幕当前画面
screen.lock();
// 解除锁定屏幕当前画面
screen.unlock();
```

屏幕锁定后，画面将被锁定不动。

#### 3.4.4 锁定节目

节目锁定后，控制器将仅播放当前锁定的节目，不再轮播其它节目。

```java
// 锁定指定节目
screen.lockProgram(programId, lockDuration);
// 解除节目锁定
screen.unlockProgram(programId);
```

其中，

programId - 节目的 id

lockDuration - 锁定的时间长度，如果为0，则一直锁定

#### 3.4.5 查询固件版本

```java
// 查询控制器当前固件版本
screen.checkFirmware();
```

#### 3.4.6 获取控制器状态

控制器状态中，包含连接在控制器上的传感器的值。如下所示：

```java 
// 通过以下接口回读控制器状态
Bx5GScreen.Result<ReturnControllersStatus> result = screen.checkControllerStatus();
if(result.isOK()){
    ReturnControllerStatus status = result.reply;
    // 取得亮度值
    status.getBrightness();
    // 取得温度传感器温度值
    status.getTemperature1();
    // status还有很多接口，根据实际应用进行调用
    ...
}
else{
    ErrorType error = result.getError();
    System.out.println(error);
}
```
### 3.5 节目与区域
节目主要用于组合屏幕上现实的内容，它由多个区域组成。控制器同一时间只能播放一个节目，它是控制器显示内容可以单独更新的最小单位（除动态区外）。
以下，我们将按步骤创建一个节目，并将其发送到控制器进行显示。

注：此处以五代控制器为例

**步骤1：**

创建节目文件，如下所示：

```java
// 创建节目文件
// 第二个参数为显示屏属性，具体可以参照Bx5GScreenProfile类
Bx5GScreenProfile profile = screen.getProfile();
ProgramBxFile p0 = new ProgramBxFile(programId, profile);
// 关于节目类的其他接口可以参考ProgramBxFile类
```
其中，programId 为节目的 id，每个节目文件都有一个唯一的id。更新节目时，id 相同的节目会被覆盖。而锁定节目时，也可以使用此 id 来锁定相应的节目。

**步骤2：**

创建相关区域，并将相关区域添加到节目文件中。

控制器支持的区域有很多种，例如：图文区、时间区、表盘区和传感器区等。其中，最常用的是图文区。图文区可以用于显示文本和图片。文字或图片可以按顺序依次添加到图文区中，而每页数据均可以设置特技方式，停留时间等属性。而创建一个图文区的步骤大致如下：

* 创建TextCaptionBxArea对象

* 创建TextBxPage或ImageFileBxPage对象

* 将创建好的page对象添加到TextCaptionBxArea中

  下例代码，创建一个文本区，并向这个区域中添加一个文本页

```java 
// 创建一个图文区
// 参数为X、Y、width、heigth
// 注意区域左边和宽度高度，不要越界
TextCaptionBxArea area = new TextCaptionBxArea(0,0,160,64);
// 创建一个数据页，并希望显示“仰邦科技”这几个字
TextBxPage page = new TextBxPage("仰邦科技");
// 将page添加到area中
area.addPage(page);
// 将图文区添加到节目中
p0.addArea(area);
```
时间区也是比较常用的区域，而时间区的创建过程大致如下：

* 创建DateTimeBxArea对象

* 设置各时间单元显示格式

* 将DateTimeBxArea添加到节目中

  具体代码如下：

```java
// 下面代码创建了一个时间区
// 注意：只需输入时间区的起始坐标，区域的宽度和高度SDK会根据字体和显示方式自动计算
DateTimeBxArea dtArea = new DateTimeBxArea(0,0,screen.getProfile());
// 设置字体
dtArea.setFont(new Font("宋体",Font.PLAIN,12));
// 设置显示颜色
dtArea.setForeground(Color.yellow);
// 多行显示还是单行显示
dtArea.setMultiline(true);
// 年月日显示格式
// 如果不需要显示，设置为null
dtArea.setDateStyle(DateStyle.YYY_MM_DD_1);
dtArea.setTimeStyle(TimeStyle.HH_MM_SS_1);
dtArea.setWeekStyle(null);
// 将时间区添加到节目中
p0.addArea(dtArea);
// 关于DateTimeBxArea类的更多接口，请参考JAVADOC中相关类的说明
```
**步骤3：**

发送更新节目

节目文件创建好后，即可将节目发送到控制器以进行显示。其代码如下所示：

```java 
// 以下为更新节目命令
screen.WriteProgram(p0);
// 更新节目还有很多命令，请参考JAVADOC
```
### 3.6 动态区
动态区是一种比较特殊的区域（[关于动态区](/zh/dual/dual/#11)），其有以下几个主要特点：

* 刷新次数没有限制
* 内容掉电不保存
* 独立于节目进行编辑
* 可以支持多个区域，且每个区域可以进行单独更新

* 可以和单个活多个节目绑定显示，即作为节目的一个区域进行显示
* 可以作为单独一个节目进行独立播放
* 灵活的控制方式：超时时间控制、是否立即显示灯

以下代码创建了一个动态区，将将其更新到控制器上显示。

五代控制器

```java
// 五代控制器动态区（BX-5E系列）
// BX-5E系列控制卡最高支持4个动态区，当屏幕上需要同时显示多个动态区时，动态区ID不可以相同
// DynamicBxRule(id,runMode,immediatePlay,timeout);
// runMode 运行模式
// 0:循环显示
// 1:显示完成后静止显示最后一页数据
// 2:循环显示，超过设定时间后数据仍未更新时不显示
// 3:循环显示，超过设定时间后数据仍未更新时显示Logo信息
// 4:循环显示，显示完最后一页后不再显示
// immediatePlay
// 0:与异步节目一起播放
// 1:异步节目停止播放，仅播放动态区
// 2:当播放完节目编号最高的异步节目后播放该动态区
DynamicBxAreaRule rule = new DynamicBxRule(0,(byte)0,(byte)1,0);
TextCaptionBxArea darea = new TextCaptionBxArea(0,0,160,64,screen.getProfile());
TextBxPage dapge = new TextBxPage("动态区123abc");
darea.addPage(dpage);
screen.writeDynamic(rule,darea);
```
六代控制器

```java
// 六代控制器动态区
DynamicBxAreaRule rule = new DynamicBxAreaRule();

// 设定动态区ID，此处ID为0，多个动态区ID不能相同
rule.setId(0);

// 设定异步节目停止播放，仅播放动态区
// 0:动态区与异步节目一起播放
// 1:异步节目停止播放，仅播放动态区
// 2:当播放完节目编号最高的异步节目后播放该动态区
rule.setImmediatePlay((byte)1);

// 设定动态区循环播放
// 0:循环播放
// 1:显示完成后静置显示最后一页数据
// 2:循环显示，超过设定时间后仍未更新时不再显示
// 3:循环显示，超过设定时间后仍未更新时显示Logo信息
// 4:显示完成最后一页后就不再显示
rule.setRunMode((byte)0);
DynamicBxArea area = new DynamicBxArea(0,0,160,32,screen.getProfile());
TextBxPage page = new TextBxPage("动态区abc");
area.addPage(page);
screen.writeDynamic(rule,area);
```

**注意：对于单双色控制器，区域之间不能出现重叠。**

## 4. Server模式

Server模式通常应用于广域网或者 GPRS/3G/4G 无线通讯的场合。在SDK中，Bx5GServer/Bx6GServer 对 server进行封装。它实现了控制器与 server 之间的链接维护，心跳解析，上下线提醒等功能。您可以像client模式一样，对广域网上的屏幕进行控制。

### 4.1 模式简介

Server的使用流程通常如下：

* 初始化API（在一个进程内只需要初始化一次）
* 建立并启动 Server
* 设定监听等待屏幕的连线与断线事件
* 获取在线屏幕
* 通过相应的 screen 对象对控制器进行相应的操作

```java 
// 初始化 SDK
Bx5GEnv.initial(); 
// 建立并启动服务器
// 此端口号为server进行监听的端口号
// 其必需与控制器参数中设置的 server port 一致
Bx5GServer server = new Bx5GServer("Hello Screen", 8036);
// 添加监听
server.addListener(new ConnectionListener());
// 启动服务器
server.start();

// 
while(true) {
   	//
    // 获取在线的控制器列表
    ArrayList<Bx5GScreen> screens = (ArrayList<Bx5GScreen>) server.getOnlineScreens();
    // 对相应的控制器进行操作
    ......
}

// 监听
public class ConnectionListener implements Bx5GServerListener {
    @Override
    public void connected(String socketId, String controllerAddr, Bx5GScreen screen) {
        // 控制器上线后，会触发此事件
        Result<ReturnPingStatus> result1 = screen.ping();
        Result<ReturnControllerStatus> result2 = screen.checkControllerStatus();
        ......
    }
    @Override
    public void disconnected(String socketId, String controllerAddr, Bx5GScreen screen) {
        // 控制器下线后，会触发此事件
   		......
    }
}
```



### 4.2 Demo说明

您可以从以下链接获取相应的 demo：

 https://github.com/onbonlab/bx.dual.java.server.git

此项目主要用于测试仰邦五代和六代网口控制器的服务器模式。其工作方式如下：

1. 服务端启动后，开始等待控制器上线

2. 每隔5秒，检查一下在线控制器
3. 依次发送节目至在线的控制器
4. 如果控制器支持动态区，则更新动态区

其主要包含以下一个类：

* Bx5GTestbench: 五代控制器的测试平台

调用方式如下：

```java
//
// 获取 testbench 实例
Bx5GTestbench g5tb = Bx5GTestbench.getInstance();

//
// run
g5tb.run(8001);
```

## 5. Android平台





