const _ = require('lodash');

let assignments = [
    `
    var $a_ºN = $num;
    var $b_ºN = $num;
    var $c_ºN = $num;
    console.log($used_ºN + $used_ºN); // +0
    `, `
    var $a_ºN = $num;   
    var $b_ºN = $num;   // # r0
    var $c_ºN = $num;   // # r0
    console.log($used_ºN);
    `, `
    var $a_ºS = 'a';
    var $b_ºS = 'b';
    var $c_ºS = 'c';
    console.log($used_ºS + $used_ºS);
    `,
    `
    var $a_ºA = ['a', '1']; // []
    var $b_ºA = ['b', '2']; // []
    var $c_ºA = ['c', '3']; // []
    console.log($used_ºA.concat($used_ºA));
    `,
     `
    var $a_ºO = {   // # b3-0
        $b_ºK: 'x',
        $c_ºK: 'y'
    };
    var $d_ºO = {   // # b3-0
        $b_ºK: 1,
        $c_ºK: 2
    };
    console.log($used_ºO.$used_ºK);
    `, `
    var $a_ºN = $num;
    var $b_ºN = $num;
    var $c = 0;
    for (i = 0; i < $used_ºN; ++i) {
        ++$c;
        if (i === $used_ºN - 2) {
            $c += 1;
        };
    };
    console.log($c);
    `, `
    var $a_ºN = '$num';
    var $b_ºN = $num;
    var $c_ºN = $num;
    $used_ºN = 5;
    console.log($usedºN);
    `, `
    function $a($b_ºP, $c_ºP) {
        console.log($used_ºP);
    };
    $a(1, 3);
    `,`
    var $rnd_ºN = $num;
    console.log($used_ºN);
    `,`
    var $rnd_ºN = $num;
    var $rnd_ºN = $num;
    var $a_ºA = [$num_4];
    var $b_ºA = [$used_ºN_2];
    console.log($b[0],$a[2]);
    `, `
    function test() {
        return // # ret-O
    };`,`
    var $a_ºN = $num;

    var a = $rndObj; // # insO_uN1
    `,`
    var $a_ºA = ["str",23,"broj","12",$arr_ºN_new2,"str",$arr_ºN_new6];
    var $rnd_ºN = $num;
    var $rnd_ºN = $num;
    var $rnd_ºN = $num;
    var $b_ºA = [] 
    var $c_ºA = [$arr_ºN_used1,$arr_ºN_new2]
    var $d = [$arr_ºN_used2]
    $c.push($d);
    console.log($c);
     `,`
     var $a_ºN = $num;
     var $b_ºN = $num;
     var $c_ºS = 'foo';
     var $d_ºS = 'bar';
     var $e_ºN = $num;
 
     var a = $rndObj_1; // # insO_N3_uS1
     console.log(a.$used_ºK);
     `,`
     var $a_ºA = [];
     var $rnd_ºN = $num;
     var $rnd_ºN = $num;
     var $rnd_ºN = $num;
     var $b_ºA = [];
     var $c_ºA = [$arr_ºN_used1,$arr_ºN_new2];
     var $d = [$arr_ºN_used2];
     $c.push($d);
     console.log($c);
      `,`
      var $a_ºN = $num;
      var $b_ºN = $num;
      var $c_ºS = 'foo';
      var $d_ºS = 'bar';
      var $e_ºN = $num;
  
      var $f_ºO = $rndObj; // # insO_N3_uS1
      console.log($f.$used_ºK);
      `,
      `
      var $g_ºN = $num;
      var $h_ºN = $num;
      var $k_ºN = $num;
      var $a_ºO_º1 = {
          $a_ºKN_º1: $num
      };
      $used_ºN = $num;
      $rnd_ºN = $num;
      `,
      `
      var $h_ºN = $num;
      var $a_ºO1 = {
         $rnd_ºKN1: $num,
         $rnd_ºKN1: $num,
         $b_ºKF1: () => {
           console.log("hello")
         }
      };
      console.log($used_ºO1.N);
      $used_ºO1.F()
      $a.$b();
      var $g_ºO2 = {
        $rnd_ºKN2: $num,
        $rnd_ºKN2: $num
      }
      console.log($used_ºO2.N)
      `,
      `
        var $rnd_ºN = $num;
        var $rnd_ºN = $num;
        var $b_ºA = [$used_ºNx2];
        var $g_ºA = ["str","foo",23];
        var $c_ºA = [$num4,$used_ºNx2];
        $var $d_ºN = $num;
        $var $used_ºN = $num;
        console.log($b[0],$c[2]);
      `
];

// let pickTask = (index = _.random(0, assignments.length - 1)) => assignments[index];

let pickTestTask = (index = assignments.length - 1) => assignments[index];

// pickTask = (index = 4) => assignments[index];

module.exports = { pickTestTask };