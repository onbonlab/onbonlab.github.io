# JAVA SDK 使用说明
## 1. 平台支持

JAVA SDK 在设计过程中，充分考虑了跨平台的需求。本 SDK 可以支持 windows/linux/android 操作系统，同时支持网络与串口通讯。而且在不同平台下，所有的操作都拥有统一的接口。

## 2. 获取 SDK

a. windows/linux demo: 

https://doc.onbonbx.com/

b. android demo: 

https://github.com/onbonlab/bx.dual.android.git

c. android 串口通讯 sdk 与 demo:

https://github.com/onbonlab/bx.dual.android.serial.git

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

### 5.1 使用说明

**步骤1:**  导入 sdk

将所有库文件拷贝至 libs 文件夹，并引入工程，如下所示：

在 module 的 build.gradle 中添加如下代码：

```gradle
implementation files('libs/bx05-0.5.0-SNAPSHOT.jar')
implementation files('libs/bx05.message-0.5.0-SNAPSHOT.jar')
implementation files('libs/bx06-0.6.0-SNAPSHOT.jar')
implementation files('libs/bx06.message-0.6.0-SNAPSHOT.jar')
implementation files('libs/log4j-1.2.14.jar')
implementation files('libs/simple-xml-2.7.1.jar')
implementation files('libs/uia-comm-0.3.3.jar')
implementation files('libs/uia-utils-0.2.0.jar')
implementation files('libs/uia-message-0.6.0.jar')

implementation(name: 'java.awt4a-0.1-release', ext: 'aar')
```

在 project 的 build.gradle 中添加如下代码：

```gradle
allprojects {
    repositories {
        google()
        jcenter()

        flatDir {
            dirs 'libs'
        }
    }
}
```

**步骤2:** sdk 初始化

SDK 初始化在整个 APP 中只能调用一次，因此，我们将其放在 application 的 onCreate() 接口调用。如下所示：

```java
public class MyApp extends Application {

    private static final String TAG="MyApp";

    @Override
    public void onCreate() {
        super.onCreate();

        try {
            // java.awt for android 初始化
            AwtEnv.link(this);
            // 是否启动抗锯齿
            AwtEnv.configPaintAntiAliasFlag(false);

            // 初始化五代
            Bx5GEnv.initial();

            // 建立 BX6G API 運行環境。
            Bx6GEnv.initial();
            Log.d(TAG, "sdk 6 version:" + Bx6GEnv.VER_INFO);
        }
        catch (Exception ex) {
            Log.d(TAG, "sdk init error");
        }
    }
}
```

**步骤3：** 在 manifest.xml 中添加相关权限

对于网络通讯，必需先在 manifest 文件中申请相关网络访问的权限，否则会出现通讯失败。

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.onbonbx.demo">
    <!-- 允许联网 -->
    <!-- 获取GSM（2g）、WCDMA（联通3g）等网络状态的信息 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- 获取wifi网络状态的信息 -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <!-- 获取wifi网络状态的信息 -->
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <!-- 保持CPU 运转，屏幕和键盘灯有可能是关闭的,用于文件上传和下载 -->
    <uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />

    <application
        android:name=".MyApp"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

**步骤4：** 在线程中调用相关接口

在 Android 系统中，网络通讯不能放在主线程中调用，而必需另起线程。通常如下：

```java
new Thread(new Runnable() {
    @Override
    public void run() {

        Bx5GScreenClient screen = new Bx5GScreenClient("screen");
        try {
            // 连接控制器
            screen.connect(ip.getText().toString(), 5005);

            // 获取控制器状态
            screen.ping();

            // 断开链接
            screen.disconnect();

        } catch (Bx5GException e) {
            e.printStackTrace();
            return;
        }
    }
}).start();
```

### 5.2 获取SDK与DEMO

您可以通过如下链接获取 ANDROID SDK 与 DEMO:

b. android demo: 

https://github.com/onbonlab/bx.dual.android.git

c. android 串口通讯 sdk 与 demo:

https://github.com/onbonlab/bx.dual.android.serial.git

## 6. 常见问题

 1. 逾时未回应问题
 逾时未回应一般是使用的控制卡型号和代码里设置的不一致导致，比如使用的控制卡型号是BX-6E1，在创建Screen对象时候，写的是new Bx6M(),就会导致该问题，SDK提供的型号有:new Bx6Q()/new Bx6M()/newBx6E(),如果使用的控制卡型号，SDK中没有提供，比如BX-6A1，可以使用new Bx6M()替代。创建Screen对象代码如下：
```java
Bx6GScreenClient screen = new Bx6GScreenClient("MyScreen",new Bx6E());
```
 2. 连接失败问题
 连接失败时候，可以检查通讯情况，在命令行ping控制卡的IP地址，使用LedshowTW软件和控制卡通讯测试，或者频繁更新节目也会导致连接失败。
 3. 表格显示问题
 SDK中不支持直接添加表格显示，需要把表格画成图片，添加到区域中进行显示，图片包括单元格和单元格里的内容，如果，某个单元格中内容有更新，则重新生成图片，替换原来图片显示。
 4. 控制卡固件版本查询
 控制卡的固件版本更新可以通过LedshowTW软来更新，设置--控制器程序维护--密码888-查询。在该界面也可以更新固件版本。通过代码查询，查询代码如下：
```java 
screen.checkFirmware();
```
 5. 动态区关联（绑定）节目
 动态区完全独立于节目更新，但是可以和节目绑定，绑定后动态区可以和节目一起显示，绑定节目代码如下：
```java 
DynamicBxAreaRule rule = new DynamicBxAreaRule();
rule.setId(0);
rule.setRunMode((byte)0);
// 新增动态区关联异步节目，一旦关联了节目，则动态区和节目一起播放
// 设定动态区关联节目
// true 所有异步节目播放时都播放该动态区
// false 由规则决定
rule.setRelativeAllProgram(false);
// 规则
// 设置动态区和节目0绑定
rule.addRelativeProgram(0);
```
 6. 什么时候用动态区，什么时候用节目
 动态区指的是频繁更新的区域，不是滚动效果，比如停车场车位信息，停车场车牌信息，传感器状态实时展示，车次状态实时更新等，需要使用动态区，节目一般用在一些欢迎标语等很少更新或不更新场合。
 7. 汉字显示方块问题
 该问题常见于Linux系统，首先需要确认的是linux系统中是否安装了中文字体，一般情况安装中文字体后即可解决，SDK中设置字体代码如下：
```java 
page.setFont(new Font("宋体",Font.PLAIN,12));
```
 8. 对齐方式设置问题
 SDK提供了一些对齐方式的设置，如果SDK中提过的对齐方式设置不能满足需求，可以把要显示的内容画成图片，在图片上排版，然后添加到区域中进行显示，SDK中对齐方式设置代码如下：
```java
// 水平对齐方式设置
// 设置居左对齐
page.setHorizontalAlignment(TextBinary.Alignment.NEAR);
// 设置居中对齐
page.setHorizontalAlignment(TextBinary.Alignment.CENTER);
// 设置居右对齐
page.setHorizontalAlignment(TextBinary.Alignment.FAR);
// 设置垂直对齐方式
// 设置居上对齐
page.setVerticalAlignment(TextBinary.Alignmet.NEAR);
// 设置居中对齐
page.setVerticalAlignment(TextBinary.Alignmet.CENTER);
// 设置居下对齐
page.setVerticalAlignment(TextBinary.Alignmet.FAR);
```
 9. 天气显示问题
 SDK中没有提供天气显示相关接口，可以自行获取天气信息数据，排版后添加到动态区来实时更新显示
 10. 服务器模式在监听里写数据和在监听外写数据的区别

 11. 手动换行显示
 换行显示有2种方式，第一是通过换行符来换行，第二是通过SDK中的接口换行，换行代码如下：
```
// 通过换行符换行
TextBxPage page = new TextBxPage("第一行\r\n第二行");
// 通过接口换行
TextBxPage page = new TextBxPage("第一行");
page.newLine("第二行");
```
 12. 区域越界问题
 区域越界指的是区域超出屏幕范围，一般情况下，最右边的区域X+区域宽度大于LED屏宽度，或者最下面区域Y+区域高度大于LED屏高度即为区域越界，如果程序中有判断是否越界，在越界的时候程序会报out of range，如果程序中没有判断是否越界，则有可能导致LED屏显示异常，判断是否越界代码如下：
```java 
if(pf.validate()!=null){
    System.out.println("pf out of range");
    return;
}
```
 13. 连接问题
 控制卡用的短连接方式通讯，所以，在发送完数据后，需要断开与控制卡的连接，再次发送数据时候，重新连接控制卡，大概步骤如下：
```java 
// 创建连接
screen.connect();
// 发送数据
......
// 断开连接
screen.disconnect();
```
 14. 其他一些显示异常问题
 显示异常，一般是更新数据相关，可以自行检查program/area/page等对象创建是否有问题，这些对象不可以为空，也不可以是空格，如果需要显示黑屏，可以使用黑色图片。



