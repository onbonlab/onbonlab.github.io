# C/C++ SDK 使用说明 - 单双色系列

## 1. 平台支持

本项目由纯C++编写， 因此，其可以正常运行于Windows, Linux平台。本文档主要针对动态链接库（C++）开发的相关说明，需要协议开发请使用我们提供的[协议文档](../dual/potocol.md)进行开发。如果你想尽快开发出一个能简单控制的软件，建议按以下流程阅读本文档后进行软件开发。

- 获取SDK
- 阅读错误码及说明
- 阅读API调用顺序
- 阅读函数说明

## 2. 获取 SDK

您可以从以下链接下载本 SDK：

[Download SDK](https://github.com/onbonlab/bx.dual.cplus.git)

## 3. 错误码及说明

动态库中每个接口函数最后都返回函数执行结果，用户可根据函数执行结果查找判断该函数的执行情况。

### *3.1错误状态*

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


## 4. 显示屏初始化说明

控制器接入动态库使用的系统前需要首先使用我司提供的 LedshowTW软件来进行控制卡
地址、通讯波特率、网络 IP(如有网口)、端口地址(如有网口)、扫描方式等设置；设置好后就可以再接入本动态库的系统中按照之前设定好的相关参数来设定显示屏的其它参数、信息和命令了。

## 5. API调用顺序

### *5.1总体次序*



API调用流程：

```flow
st=>start: bxDual InitSdk
cond=>condition: 更新节目或者更新动态区
op=>operation: bxDual_program_setScreenParams_G56
op1=>operation: bxDual_program_addProgram
op2=>operation: bxDual_program_AddArea
op3=>operation: bxDual_program_picturesAreaAddTxt
添加字符串内容
op4=>operation: bxDual_program_pictureAreaAddPic
添加图片内容
op5=>operation: program_timeAreaAddContent
添加时间内容
op6=>operation: bxDual_program_timeAreaAddAnalogClock
添加表盘内容
op7=>operation: bxDual_program_IntegrateProgramFile
op8=>operation: bxDual_cmd_ofsStartFileTransf
op9=>operation: bxDual_cmd_ofsEndFileTransf
op10=>operation: bxDual_program_deleteProgram
op11=>operation: bxDual dynamicArea AddAreaWithTxt 5G 
e=>end: bxDual_releaseSdk

st->cond(yes)->op->op1->op2->op3->op7->op8->op9->op10->e
cond(no)->op11->e
```

