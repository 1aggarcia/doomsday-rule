/**
 * Old code I originally wrote between 2020-21, lightly refactored
 */

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const cents = [2, 0, 5, 3]
const doomsdays = [3,0,0,4,2,6,4,1,5,3,0,5]
const currentYear = new Date().getUTCFullYear()
const currentCent = Math.floor(currentYear/100)

document.getElementById('start').value = currentYear - 399;
document.getElementById('end').value = currentYear;

function getCentury(window_year, year) {
	window_cent = Math.floor(window_year / 100)
	if (year > window_year%100)  {
		return (window_cent-1) + year
	} else {
		return (window_cent) + year
	}
}

function loopDays() {
	const dates = document.getElementById('dates');
	const start = document.getElementById('start');
	const end = document.getElementById('end');
	let yearError = false;

	if (start.value < 1 || start.value.length < 4 || isNaN(start.value)) {
		start.style = "border:1px solid #FF0000;outline:none;;";
		yearError = true;
	} else {
		start.style = "";
	}
	if (end.value < 1 || end.value.length < 4 || isNaN(end.value)) {
		end.style = "border:1px solid #FF0000;outline:none;;";
		yearError = true;
	} else {
		end.style = "";
	}

	if (yearError == false) {
		document.getElementById('dList').innerHTML = "";
		let i;
		for (i=0; i < dates.value; i++) {
			createDays(i);
		}
	}

	dates.blur()
	start.blur()
	end.blur()
}

function createDays(n) {
	const start = parseInt(document.getElementById('start').value);
	const end = parseInt(document.getElementById('end').value)
	const year = String(getRndInt(start, end)).padStart(4,'0');
	const month = String(getRndInt(1,12)).padStart(2,'0');
	let mValue;

	if ([4, 6, 9, 11].includes(month)) {
		mValue = 30;
	} else if (month !=2) {
		mValue = 31;
	} else if (isLeapYear(year)) {
		mValue = 29;
	} else {
		mValue = 28;
	}

	const day = String(getRndInt(1,mValue)).padStart(2,'0');
	
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
	const showBtn = document.getElementById("showBtn" + n);
	const output = document.getElementById("out" + n);
	const calcBtn = document.getElementById("calcBtn" + n);
	
	showBtn.remove();
	output.style.visibility = 'visible'
	calcBtn.innerHTML = 'Details'
	calcBtn.style.visibility = 'visible'	
}


function calcDay(year, month, day) {
	const yearInput = document.getElementById("year");
	const monthInput = document.getElementById("month");
	const dayInput = document.getElementById("day");
	
	yearInput.value = year;
	monthInput.value = month;
	dayInput.value = day;

	verifyDate();
	window.location.href = '#calculator';
		
}

function getRndInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printDate() {
	// Get DOM elements
	const mathDate = document.getElementById("mathDate");
	const mathLTD = document.getElementById("mathLTD");
	const mathCent = document.getElementById("mathCent");
	const mathDay = document.getElementById("mathDay");
	const mathDOW = document.getElementById("mathDOW");

	const month = document.getElementById("month");
	const day = document.getElementById("day");
	const year = document.getElementById("year");

	// Start calculating
	const century = Math.floor(year.value/100);
	const centOff = cents[century%4]
	const ltd = year.value % 100;
	const leapYrs = Math.floor(ltd / 4);
	const ltdSum = ltd + leapYrs;
	const ltdOff = ltdSum % 7;
	
	const dayStr = months[month.value-1]+" "+day.value;

	let doomsday = doomsdays[month.value-1]
	if (isLeapYear(year.value) && month.value <= 2) {
		doomsday = doomsday + 1;
	}
	const moddedDay = day.value % 7
	const dayOff = moddedDay - doomsday
	
	const dowSum = ltdOff + centOff + dayOff
	const dow = ((dowSum % 7) + 7 ) % 7
		
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
	const text = document.getElementById("ltd")
	const ltd = text.value;
	const ltdOut1 = document.getElementById("ltdOut1");
	const ltdOut2 = document.getElementById("ltdOut2");
	const ltdOut3 = document.getElementById("ltdOut3");
	const ltdOut4 = document.getElementById("ltdOut4");
	const ltdOut5 = document.getElementById("ltdOut5");

	const a1 = "'" + ltd.padStart(2,"0")+" % 28";
	const a2 = Math.floor(ltd % 28);

	const b1 = a2 + " / 4";
	const b2 = Math.floor(a2 / 4);

	const c1 = a2 + " + " + b2;
	const c2 = a2 + b2;

	const d1 = c2 + " % 7";
	const d2 = c2 % 7;


	ltdOut1.innerHTML = "&#39;"+ltd.padStart(2,"0");
	ltdOut2.innerHTML = "<i>Years</i>: " + a1 + " = " + a2;
	ltdOut3.innerHTML = "<i>Leap yrs</i>: " + b1 + " = " + b2;
	ltdOut4.innerHTML = "<i>Sum</i>: " + c1 + " = " + c2;
	ltdOut5.innerHTML = "<i>LTD Off</i>: " + d1 + " = " + d2;

	text.value = "";
	text.blur();
}

function formatDate(year, month, day) {
	const sYear = String(year).padStart(4,"0");
	const sMonth = String(month).padStart(2,"0");
	const sDay = String(day).padStart(2,"0");
	const formValue = document.getElementById("format").value;

	switch(formValue) {
		case "UK":
			return sDay+" "+months[month-1]+" "+sYear;
		case "ISO":
			return sYear+"-"+sMonth+"-"+sDay;
		case "USnum":
			return sMonth+"-"+sDay+"-"+sYear;
		case "UKnum":
			return sDay+"-"+sMonth+"-"+sYear;
	}
}

function verifyDate() {
	const year = document.getElementById("year");
	const month = document.getElementById("month");
	const day = document.getElementById("day");
	const dateError = false;

	year.blur();	
	month.blur()
	day.blur();

	if ((year.value < 1 && year.value.length != 2) || isNaN(year.value) || year.value.length%2 > 0) {
		year.style = "border:1px solid #FF0000;outline:none;";
		dateError = true;
	} else {
		year.style = "";
		if (year.value.length == 2) {
			year.value = getCentury(currentYear + 15, year.value)
		}
	}

	if (month.value < 1 || month.value > 12 || isNaN(month.value)) {
		dateError = true;
		month.style = "border:1px solid #FF0000;outline:none;"
	} else {
		month.style = "";
	}

	if (day.value < 1 || day.value > 31 || isNaN(day.value)) {
		day.style = "border:1px solid #FF0000;outline:none;";
		dateError = true;
	} else {
		day.style = "";
	}

	if (dateError == false) {
		printDate()
	}
}

function clearCalcInput() {
	document.getElementById("year").value = "";
	document.getElementById("month").value = "";
	document.getElementById("day").value = "";
}

/** Return true iff the given year is a leap year */
function isLeapYear(year) {
	return year % 4 == 0 && year % 100 !=0 || year % 400 == 0
}