var TYPES = ["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"];
// matrix[row=attack][col=defend] -> multiplier (Gen 6+)
var M = [
 [1,1,1,1,1,1,1,1,1,1,1,1,0.5,0,1,1,0.5,1],
 [1,0.5,0.5,1,2,2,1,1,1,1,1,2,0.5,1,0.5,1,2,0.5],
 [1,2,0.5,1,0.5,1,1,1,2,1,1,1,2,1,0.5,1,1,1],
 [1,1,2,0.5,0.5,1,1,1,2,0.5,1,1,1,1,0.5,1,1,1],
 [1,0.5,2,0.5,0.5,1,1,0.5,2,0.5,1,0.5,2,1,0.5,1,0.5,1],
 [1,0.5,0.5,1,2,0.5,1,1,2,2,1,1,2,1,2,1,0.5,1],
 [2,1,1,1,1,2,1,0.5,1,0.5,0.5,0.5,2,0,1,2,2,0.5],
 [1,1,1,1,2,1,1,0.5,0.5,1,1,1,0.5,0.5,1,1,0,2],
 [1,2,1,0,2,1,1,2,1,0,1,0.5,2,1,1,1,2,1],
 [1,1,1,2,2,1,2,1,1,1,1,0.5,0.5,1,1,1,0.5,1],
 [1,1,1,1,1,1,2,2,1,1,0.5,1,1,1,1,0,0.5,1],
 [1,0.5,1,1,2,1,0.5,0.5,1,0.5,2,1,2,0.5,1,2,0.5,0.5],
 [1,2,1,1,1,2,0.5,1,0.5,2,1,2,1,1,1,1,0.5,1],
 [0,1,1,1,1,1,0,0.5,1,1,2,0.5,1,2,1,0.5,1,1],
 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,0.5,2],
 [1,1,1,1,1,1,0.5,1,1,1,2,2,1,2,1,0.5,1,0.5],
 [1,0.5,0.5,0.5,1,2,2,0,2,1,1,1,2,1,1,1,0.5,2],
 [1,0.5,1,1,1,1,2,0.5,1,1,1,1,1,2,2,2,0.5,1]
];
var atk=document.getElementById('atk'),def1=document.getElementById('def1'),def2=document.getElementById('def2'),stab=document.getElementById('stab');
TYPES.forEach(function(t,i){var o1=new Option(t,i);var o2=new Option(t,i);atk.add(o1);def1.add(o2);});
def2.length=1; TYPES.forEach(function(t,i){def2.add(new Option(t,i));});

function fmt(v){
  if(v===0) return ["0×","none","No effect"];
  if(v===0.25) return ["0.25×","v025","¼× (two resistances)"];
  if(v===0.5) return ["½×","v05","Not very effective"];
  if(v===1) return ["1×","","Neutral"];
  if(v===2) return ["2×","v2","Super-effective"];
  if(v===4) return ["4×","v2","Quadruple (double super-effective)"];
  return [v+"×","" ,""];
}
function calc(){
  var r=+atk.value, c1=+def1.value, c2=+def2.value, s=+stab.value;
  var v=M[r][c1]; if(c2>=0) v*=M[r][c2]; v*=s;
  var f=fmt(v);
  var el=document.getElementById('mult');
  el.textContent=f[0]; el.className='mult '+f[1];
  var note = TYPES[r]+" → "+TYPES[c1]+(c2>=0?(" / "+TYPES[c2]):"");
  note += (c2>=0?("  =  "+M[r][c1]+"×"+M[r][c2]+(s>1?"×1.5 STAB":"")+"  =  "+v+"×"):("  =  "+v+"×"+(s>1?" (incl. STAB)":"")));
  note += "  —  "+f[2];
  document.getElementById('multnote').textContent=note;
}
[atk,def1,def2,stab].forEach(function(s){s.addEventListener('change',calc);});
calc();

// build chart table
var tbl=document.getElementById('chartTable');
var thead='<tr><th></th>'+TYPES.map(function(t){return '<th>'+t.slice(0,4)+'</th>';}).join('')+'</tr>';
var rows='';
M.forEach(function(row,i){
  var cells='<td class="rowh">'+TYPES[i]+'</td>';
  row.forEach(function(v){
    var cls = v===2?'v2':(v===0.5?'v05':(v===0?'v0':(v===0.25?'v025':'')));
    var disp = v===0?'0':(v===0.5?'½':(v===0.25?'¼':(v===1?'1':(v===2?'2':v))));
    cells+='<td class="'+cls+'">'+disp+'</td>';
  });
  rows+=('<tr>'+cells+'</tr>');
});
tbl.innerHTML='<thead>'+thead+'</thead><tbody>'+rows+'</tbody>';
