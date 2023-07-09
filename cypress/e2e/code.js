function humanReadable(seconds) {

let hour = String(Math.trunc(seconds/3600));
let min = String(Math.trunc((seconds/3600 - hour)*60));
let sec = String(Math.round(((seconds/3600 - hour)*60 - min)*60));
console.log(hour, min, sec);
if (hour.length === 1){
    hour = 0+hour;
    }
if (min.length === 1) {
        min = 0+min;
    } 
if (sec.length === 1) {
            sec = 0+sec;
    } else if (sec==60) {
        min=String(Number(min)+1);
        sec= '00';
    } else {
        
    }
return `${hour}:${min}:${sec}`;
}


console.log(humanReadable(221880));