/*
function clip(pt0, pt1, view)
{
	//pt0,pt1 = {x: 999, y: 999}
	//view = {x_min: 9, x_max: 9, y_min: 9, y_max: 9}
}
*/

var LEFT = 32;	// binary 100000
var RIGHT = 16;	// binary 010000
var BOTTOM = 8;	// binary 001000
var TOP = 4; 	// binary 000100
var FRONT = 2 // binary 000010
var BACK = 1  // binary 000001
var canvas;
var ctx;

function init() {
	canvas = document.getElementById("mycanvas");
	canvas.width = 800;
	canvas.height = 600;
	ctx = canvas.getContext("2d");

	var view = {x_min: 0, x_max: 799, y_min: 0, y_max: 599};
	var line1 = clipLine({x: -100, y: 200}, {x: 300, y: -100}, view);
	if (line1 !== null) {
		console.log(line1);
		DrawLine(line1.pt0, line1.pt1, "#8A32BD");
	}
}
// new functions for parrallel and perspective. par is on the 0 i think
// per is on what the z axis is.

/*
function parView()
{
}

function perView()
{
}
*/

function Outcode(pt, viewrect) {
	var outcode = 0;
	if (pt.x < viewrect.x_min) outcode += LEFT;
	else if (pt.x > viewrect.x_max) outcode += RIGHT;
	else if (pt.y < viewrect.y_min) outcode += BOTTOM;
	else if (pt.y > viewrect.y_max) outcode += TOP;
    //else if (
	return outcode;
    // add NEAR and FAR outcode else ifs. 
}

function clipLine(pt0, pt1, viewrect) {
	var done = false;
	var line = null;
	var endpt0 = {x: pt0.x, y: pt0.y};
	var endpt1 = {x: pt1.x, y: pt1.y};

	var outcode0, outcode1, selected_outcode, t;
	while (!done) {
		outcode0 = Outcode(endpt0, viewrect);
		outcode1 = Outcode(endpt1, viewrect);
		//console.log(endpt0, endpt1);
		if ((outcode0 | outcode1) === 0) { // trivial accept
			done = true;
			line = {pt0: endpt0, pt1: endpt1};
		}
		else if ((outcode0 & outcode1) !== 0) { // trivial reject
			done = true;
		}
		else { // 
			if (outcode0 !== 0) {
				selected_outcode = outcode0;
			}
			else {
				selected_outcode = outcode1;
			}

			if (selected_outcode & LEFT) { //same as >= 0??
				t = (viewrect.x_min - endpt0.x) / (endpt1.x - endpt0.x);
			}
            
			else if (selected_outcode & RIGHT)
            {
				t = (viewrect.x_max - endpt0.x) / (endpt1.x - endpt0.x);		
			}
			else if (selected_outcode & BOTTOM)
            {
				t = (viewrect.y_min - endpt0.y) / (endpt1.y - endpt0.y);
			}
			else if (selected_outcode & TOP)
            {
				t = (viewrect.y_max - endpt0.y) / (endpt1.y - endpt0.y);
			}
            else if (selected_outcode & FRONT)
            {
                t = ( //  new equations for clip of front
            }
            else // BACK
            {
                t = ( //  new equations for clip of back;
            }

			// replace selected endpoint with intersection
			if (selected_outcode === outcode0) {
				endpt0.x = endpt0.x + t * (endpt1.x - endpt0.x);
				endpt0.y = endpt0.y + t * (endpt1.y - endpt0.y);
			}
			else {
				endpt1.x = endpt0.x + t * (endpt1.x - endpt0.x);
				endpt1.y = endpt0.y + t * (endpt1.y - endpt0.y);
			}
		}
	}

	return line;
}

function DrawLine(pt0, pt1, color) {
	// draw line
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(pt0.x, pt0.y);
	ctx.lineTo(pt1.x, pt1.y);
	ctx.stroke();

	// draw endpoints
	ctx.fillStyle = "#000000";
	ctx.fillRect(pt0.x - 3, pt0.y - 3, 6, 6);
	ctx.fillRect(pt1.x - 3, pt1.y - 3, 6, 6);
}
