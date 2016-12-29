require("kernel/class/Base.js");

let name = "1234";
class Age
{
   getName()
   {
      
   }
}
var array = [1, 2, 3, 4, 5, 6];
//传统写法
array.forEach(function(v, i, a) {
   console.log(v);
});
//ES6
array.forEach(v => console.log(v));