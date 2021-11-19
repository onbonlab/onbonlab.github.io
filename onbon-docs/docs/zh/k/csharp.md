# C# SDK 使用说明 - 字库系列

## 1. 平台支持

本项目由C++编写接口，C#封装一层C++接口， 因此，其可以正常运行于Windows平台。本文档主要针对动态链接库（C#）开发的相关说明，需要协议开发请使用我们提供的[协议文档](../k/potocol.md)进行开发。
如果你想尽快开发出一个能简单控制的软件，建议按以下流程阅读本文档后进行软件开发。



- 获取SDK
- 阅读错误码及说明
- 阅读API调用顺序
- 阅读函数说明

## 2. 获取 SDK

您可以从以下链接下载本 SDK：

https://github.com/onbonlab/bx.k.java.git

## 3 错误码及说明

动态库中每个接口函数最后都返回函数执行结果，用户可根据函数执行结果查找判断该函数的执行情况。

### *2.1错误状态*

| 错误名称             | 代码 | 说明                                            |
| -------------------- | ---- | ----------------------------------------------- |
| ERR_NO               | 0    | 没有错误                                        |
| ERR_OUTOFGROUP       | 1    | Command Group Error                             |
| ERR_NOCMD            | 2    | Command Not Found                               |
| ERR_BUSY             | 3    | The Contorller is busy now                      |
| ERR_MEMORYVOLUME     | 4    | Out of the Memory Volume                        |
| ERR_CCHECKSUM        | 5    | CRC16 Checksum Error                            |
| ERR_FILENOTEXIST     | 6    | File Not Exist                                  |
| ERR_FLASH            | 7    | Flash Access Error                              |
| ERR_FILE_DOWNLOAD    | 8    | File Download Error                             |
| ERR_FILE_NAME        | 9    | File Name Error                                 |
| ERR_FILE_TYPE        | 10   | File Type Error                                 |
| ERR_FILE_CRC16       | 11   | File CRC16 Error                                |
| ERR_FONT_NOT_EXIST   | 12   | Font Library Not Exist                          |
| ERR_FIRMWARE_TYPE    | 13   | Firmware Type Error (Check the controller type) |
| ERR_DATE_TIME_FORMAT | 14   | Date Time format error                          |
| ERR_FILE_EXIST       | 15   | File Exist for File overwrite                   |
| ERR_FILE_BLOCK_NUM   | 16   | File block number error                         |
| ERR_COMMUNICATE      | 100  | 通信失败                                        |
| ERR_PROTOCOL         | 101  | 协议数据不正确                                  |
| ERR_TIMEOUT          | 102  | 通信超时                                        |
| ERR_NETCLOSE         | 103  | 通讯断开                                        |
| ERR_INVALID_HAND     | 104  | 无效句柄                                        |
| ERR_PARAMETER        | 105  | 参数错误                                        |
| ERR_SHOULDREPEAT     | 106  | 需要重复上次的错误包                            |
| ERR_FILE             | 107  | 无效文件                                        |


## 3 显示屏初始化说明

控制器接入动态库使用的系统前需要首先使用我司提供的 LedshowZK2017软件来进行控制卡
地址、通讯波特率、网络 IP(如有网口)、端口地址(如有网口)、扫描方式等设置；设置好后就可以再接入本动态库的系统中按照之前设定好的相关参数来设定显示屏的其它参数、信息和命令了。

## 4 API调用顺序

### *4.1总体次序*

在执行其他操作之前，首先执行函数InitSDK初始化动态库，然后选择通讯模式， 设置不同模式
下的参数，连接控制器(广播模式执行函数CreateBroadCast，网络固定ip模式执行函数CreateClient，
网络modbus模式执行函数CreateTcpModbus， 485总线模式执行函数CreateComClient， 串口modbus模式执行函数CreateComModbus)，设置网络超时时间执行函数SetTimeout。 之后可以执行图文区节目（发送节目OFS_SendFileData、删除节目OFS_DeleteFile、锁定/解锁节目SCREEN_LockProgram）、动态区节目（发送节目SCREEN_SendDynamicArea、删除节目SCREEN_DelDynamicArea）、开关（强制开关机SCREEN_ForceOnOff，定时开关机SCREEN_TimeTurnOnOff，取消定时开关机SCREEN_CancelTimeOnOff）、固件查询（查询固件信CON_CheckCurrentFirmware，激活固件CON_FirmwareActivate）、控制器状态查询（CON_ControllerStatus）、 （亮度调整SCREEN_SetBrightness，复位CON_Reset， ping CON_PING， 校时CON_SytemClockCorrect） 等操作。例如RS485模式中函数的调用：

```flow
​```flow
st=>start: InitSdk
op=>operation: CreateBroadCast CreateComModbus CreateClient  CreateTcpModbus CreateComClient 创建连接
cond=>condition:  sendprogram or senddynamic?
op1=>operation: OFS_SendFileData 发送数据
op2=>operation: SendDynamicArea发送动态区
op3=>operation: SendProgram发送节目
op4=>operation: Destroy销毁通讯
e=>end: ReleaseSdk
st->op->cond
cond(yes)->op1->op3
cond(no)->op2
op2->op4
op3->op4
op4->e
​```
```

```
​```flow
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
​```
```

