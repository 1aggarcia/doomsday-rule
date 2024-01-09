/**
 * Old code I originally wrote between 2020-21.
 * Quite messy but I don't feel like refactoring it,
 * instead the new jQuery code is in "yearGuesser.js"
 */

let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
let cents = [2, 0, 5, 3]
let doomsdays = [3,0,0,4,2,6,4,1,5,3,0,5]
let current_year = new Date().getUTCFullYear()
let current_cent = Math.floor(current_year/100)

document.getElementById('start').value = current_year - 399;
document.getElementById('end').value = current_year;

function get_century(window_year, year) {
	window_cent = Math.floor(window_year / 100)
	if (year > window_year%100)  {
		return (window_cent-1) + year
	} else {
		return (window_cent) + year
	}
}

function loopDays() {
	let dates = document.getElementById('dates');
	let start = document.getElementById('start');
	let end = document.getElementById('end');
	let year_error = false;

	if (start.value < 1 || start.value.length < 4 || isNaN(start.value)) {
		start.style = "border:1px solid #FF0000;outline:none;;";
		year_error = true;
	} else {
		start.style = "";
	}
	if (end.value < 1 || end.value.length < 4 || isNaN(end.value)) {
		end.style = "border:1px solid #FF0000;outline:none;;";
		year_error = true;
	} else {
		end.style = "";
	}

	if (year_error == false) {
		document.getElementById('dList').innerHTML = "";
		let i;
		for (i=0; i < dates.value; i++) {
				createDays(i)
		}
	}

	dates.blur()
	start.blur()
	end.blur()
}

function createDays(n) {
		let start = parseInt(document.getElementById('start').value);
		let end = parseInt(document.getElementById('end').value)
		let year = String(getRndInt(start, end)).padStart(4,'0');
		let month = String(getRndInt(1,12)).padStart(2,'0');
		let mValue;

		if (month==4||month==6||month==9||month==11) {
			mValue = 30;
		} else if (month !=2) {
			mValue = 31;
		} else if (year%4==0&&year%100!=0||year%400==0) {
			mValue = 29;
		} else {
			mValue = 28;
		}

		let day = String(getRndInt(1,mValue)).padStart(2,'0');
		
		span = document.createElement('span');
		span.id = 'date'+n;
		span.innerHTML = (n+1)+'. '+formatDate(year, month, day)+' ';
		d = new Date(year+"-"+month+"-"+day);
		br = document.createElement('br');

		showBtn = document.createElement('button');
		showBtn.setAttribute("onclick","showDay(" + n + ")");
		showBtn.innerHTML = 'Show Day';
		showBtn.id = 'showBtn'+n;

		calcBtn = document.createElement('button');
		calcBtn.setAttribute("onclick","calcDay(" + year + ", " + month + ", " + day + ")");
		calcBtn.id = 'calcBtn'+n;
		calcBtn.style.visibility = 'hidden';

		span2 = document.createElement('span');
		span2.id = 'out'+n;
		span2.innerHTML = " " + days[d.getUTCDay()] + " ";
		span2.style.visibility = 'hidden';
		
		let dList = document.getElementById('dList');
		dList.appendChild(span)
		dList.appendChild(showBtn);
		dList.appendChild(span2);
		dList.appendChild(calcBtn);
		dList.appendChild(br);
}	
		
function showDay(n) {
		let showBtn = document.getElementById("showBtn" + n);
		let output = document.getElementById("out" + n);
		let calcBtn = document.getElementById("calcBtn" + n);
		
		showBtn.remove();
		output.style.visibility = 'visible'
		calcBtn.innerHTML = 'Details'
		calcBtn.style.visibility = 'visible'	
}


function calcDay(year, month, day) {
		let yearInput = document.getElementById("year");
		let monthInput = document.getElementById("month");
		let dayInput = document.getElementById("day");
		
		yearInput.value = year;
		monthInput.value = month;
		dayInput.value = day;

		verifyDate();
		window.location.href = '#calculator';
		
}

function getRndInt(min, max) {
		return Math.floor(Math.random()*(max-min+1))+min;
}

function printDate() {
        
        let mathDate = document.getElementById("mathDate");
        let mathLTD = document.getElementById("mathLTD");
        let mathCent = document.getElementById("mathCent");
        let mathDay = document.getElementById("mathDay");
        let mathDOW = document.getElementById("mathDOW");

		let month = document.getElementById("month");
		let day = document.getElementById("day");
		let year = document.getElementById("year");
    
		let century = Math.floor(year.value/100);
        let centOff = cents[century%4]
	let ltd = year.value % 100;
        let leapYrs = Math.floor(ltd / 4);
        let ltdSum = ltd + leapYrs;
        let ltdOff = ltdSum % 7;
        
        let dayStr = months[month.value-1]+" "+day.value;
        let doomsday = doomsdays[month.value-1]
        if (month.value <= 2) {
            if (year.value%4 == 0 && year.value%100 != 0 || year.value%400 == 0) {
                doomsday = doomsday + 1
            }
        }
        let moddedDay = day.value%7
        let dayOff = moddedDay - doomsday
        
        let dowSum = ltdOff + centOff + dayOff
	let dow = ((dowSum%7) + 7 ) % 7
		
        mathDate.innerHTML = formatDate(year.value, month.value, day.value)

        mathDay.innerHTML =
            "<i>Day</i>: "+
            dayStr + " &#8594 ("+
            day.value + " % 7) - " + doomsday + " = " +
            moddedDay + " - " + doomsday + " = " +
            dayOff;
        mathCent.innerHTML =
            "<i>Century</i>: "+
            century*100 + " &#8594 "+
            century+" % 4 = "+
            century%4 + " &#8594 "+
            centOff;
        mathLTD.innerHTML =
            "<i>LTD</i>: '"+
            String(ltd).padStart(2,"0") + " &#8594 (" +
            ltd + "+(" + ltd + "/4))%7 &#8594 ("+
            ltd + "+" + leapYrs + ")%7 = ("+
            ltdSum + ")%7 = "+
            ltdOff;  

        mathDOW.innerHTML = 
            "<i>Day of Week</i>: (" +
            dayOff + " + " + centOff + " + " + ltdOff + ")%7 = " +
            dowSum + " % 7 = " +
            dow + " &#8594 " + days[dow];
}


function getLtdOff() {
		let text = document.getElementById("ltd")
		let ltd = text.value;
		let ltdOut1 = document.getElementById("ltdOut1");
		let ltdOut2 = document.getElementById("ltdOut2");
		let ltdOut3 = document.getElementById("ltdOut3");
		let ltdOut4 = document.getElementById("ltdOut4");
		let ltdOut5 = document.getElementById("ltdOut5");

		let a1 = "'" + ltd.padStart(2,"0")+" % 28";
		let a2 = Math.floor(ltd % 28);

		let b1 = a2 + " / 4";
		let b2 = Math.floor(a2 / 4);

		let c1 = a2 + " + " + b2;
		let c2 = a2 + b2;

		let d1 = c2 + " % 7";
		let d2 = c2 % 7;


		ltdOut1.innerHTML = "&#39;"+ltd.padStart(2,"0");
		ltdOut2.innerHTML = "<i>Years</i>: " + a1 + " = " + a2;
		ltdOut3.innerHTML = "<i>Leap yrs</i>: " + b1 + " = " + b2;
		ltdOut4.innerHTML = "<i>Sum</i>: " + c1 + " = " + c2;
		ltdOut5.innerHTML = "<i>LTD Off</i>: " + d1 + " = " + d2;

		text.value = "";
		text.blur();
}

function formatDate(year, month, day) {
		let sYear = String(year).padStart(4,"0");
		let sMonth = String(month).padStart(2,"0");
		let sDay = String(day).padStart(2,"0");
		let formValue = document.getElementById("format").value;
		if (formValue=="UK") {
				return sDay+" "+months[month-1]+" "+sYear;
		}
		if (formValue=="ISO") {
				return sYear+"-"+sMonth+"-"+sDay;
		}
		if (formValue=="USnum") {
			return sMonth+"-"+sDay+"-"+sYear;
		}
		if (formValue=="UKnum") {
			return sDay+"-"+sMonth+"-"+sYear;
		}
}

function verifyDate() {
	let year = document.getElementById("year");
	let month = document.getElementById("month");
	let day = document.getElementById("day");
	let date_error = false;

	year.blur();	
	month.blur()
	day.blur();

	if ((year.value < 1 && year.value.length != 2) || isNaN(year.value) || year.value.length%2 > 0) {
		year.style = "border:1px solid #FF0000;outline:none;";
		date_error = true;
	} else {
		year.style = "";
		if (year.value.length == 2) {
			year.value = get_century(current_year+15, year.value)
		}
	}

	if (month.value < 1 || month.value > 12 || isNaN(month.value)) {
		date_error = true;
		month.style = "border:1px solid #FF0000;outline:none;"
	} else {
		month.style = "";
	}

	if (day.value < 1 || day.value > 31 || isNaN(day.value)) {
		day.style = "border:1px solid #FF0000;outline:none;";
		date_error = true;
	} else {
		day.style = "";
	}

	if (date_error == false) {
		printDate()
	}
}

function clearCalcInput() {
	document.getElementById("year").value = "";
	document.getElementById("month").value = "";
	document.getElementById("day").value = "";
}