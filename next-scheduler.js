function NextOp(op, complete) {
    var _op = op;
    var _complete = complete;
    var _nextOp = null;
    var _leader = this;
    var _parallel = [];
    var latch = 1;
    var hasBarrier = false;

    this.start = function() {
        latch = _parallel.length+1;
        _op();
        for(var i=0;i<_parallel.length;i++) {
            _parallel[i].setLeader(this);
            _parallel[i].start();
        }
    }
    this.finish = function() {
        _complete();
        if(!hasBarrier && _nextOp!=null) {
            _nextOp.start();
        }
        _leader.countdown();
    }
    this.setLeader = function(leader) {
        _leader = leader;
    }
    this.setNext = function(nextOp) {
        _nextOp = nextOp;
    }
    this.setParallel = function(parallel) {
        _parallel = parallel;
    }
    this.addParallel = function(parallel) {
        _parallel.push(parallel);
    }
    this.setBarrier = function(barrier) {
        hasBarrier = barrier;
    }

    this.countdown = function() {
        if(hasBarrier) {
            latch--;
            if(latch==0 && _nextOp!=null) {
                _nextOp.start();
            }
        }
    }
}

function NextScheduler() {
    var chain = [];

    this.next = function(op, followerOps) {
        var addOp = op;
        if(followerOps!==undefined) {
            if(followerOps instanceof Array) {
                addOp.setParallel([].concat(followerOps));
            } else {
                addOp.addParallel(followerOps);
            }
        }
        var len = chain.length;
        if(len>0) {
            chain[len-1].setNext(addOp);
        }
        chain.push(addOp);
        return this;
    }

    this.barrier = function() {
        var len = chain.length;
        if(len>0) {
            chain[len-1].setBarrier(true);
        }
        return this;
    }

    this.start = function() {
        if(chain.length>0) {
            chain[0].start();
        }
    }
}