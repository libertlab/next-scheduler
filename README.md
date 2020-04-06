## NextScheduler

> **多个异步操作按顺序串行执行的一种简单实现**（JavaScript版）。

### 1. 常见的使用场景

1. 前端需要提交多个异步Ajax请求，当多个请求都完成时，执行下一步的操作。
2. 前端实现了多个交互动画，要求动画按照指定流程（顺序）播放。
3. 前端需要编制一个异步交互流程，要求用户完成上一步操作之后才进行下一步的操作。

### 2. 需求

先分析一个例子。有A、B、C、D一共4个异步操作，要求是：

**A先执行，然后执行B、C，最后，当B和C都执行完成之后，开始执行D**。

### 2. 如何使用（示例）

```java
    //next-scheduler.js提供2个抽象：
    //1. NextOp封装一个异步操作
    //2. NextScheduler进行调度控制
    var op1 = new NextOp(function(){
		setTimeout(function() {
            //setTimeout模拟耗时操作，在操作完成之后调用finish()
            op1.finish();
        }, 1000);
    }, function(){
        console.log('op1 finished.');
    });
    var op2 = new NextOp(function(){
        setTimeout(function() {
        	op2.finish();
        }, 1000);
    }, function(){
        console.log('op2 finished.');
    });
    var op2_2 = new NextOp(function(){
        setTimeout(function() {
            op2_2.finish();
        }, 2000);
    }, function(){
        console.log('op2_2 finished.');
    });
    var op2_3 = new NextOp(function(){
        setTimeout(function() {
            op2_3.finish();
        }, 3000);
    }, function(){
        console.log('op2_3 finished.');
    });

    var op3 = new NextOp(function(){
        setTimeout(function() {
            op3.finish();
        }, 1000);
    }, function(){
        console.log('op3 finished.');
    });


    var scheduler = new NextScheduler();
    //执行顺序是：op1--(op2,op2_2,op2_3)--op3
    //其中加了barrier()是要求op2,op2_2,op2_3全部执行完成之后才执行op3
    //否则，当op2执行完之后会立即执行op3
    scheduler.next(op1).next(op2, [op2_2,op2_3]).barrier().next(op3).start();

    //10秒钟后再次开始调度
    setTimeout(function(){
        scheduler.start();
    }, 10000);
```



