先简单介绍下
安装：
npm install csd-auto -g

使用：
csdAuto [file]

进入你新建的[file]，执行npm install

当开发的时候使用gulp default

开始尽情的写代码了吧!

发布的时候使用gulp build


关于CSS,您可以使用less或者sass,或者直接写CSS代码,只能选择一种方式;

project.json是您的工程配置文件,可以写上你的项目名称,项目本地服务器端口号


{
  "projectName":"财神道前端自动化工作流",
  "localserver" : {
    "port" : "8082"
  },
  //文件对应的目录
  "dir":{
    "images":"/images",
    "js":"/js",
    "css":"/css",
    "font":"/font"
  },
  //输出的JS和CSS文件名
  "export":{
    "js":"app",
    "css":"style"
  }
}


src 是你的开发目录,在本地调试的时候可以使用这个目录

dist 是在build之后产生的,是生产环境下使用的目录


