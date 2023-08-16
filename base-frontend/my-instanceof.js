function instance(left, right){
    let leftValue = left.__proto__;
    let rightValue = right.protoType;
    while(true){
        if(leftValue === null){
            return false;
        }
        if(leftValue === rightValue){
            return true;
        }
        leftValue = leftValue.__proto__;
    }
}