int = parseInt

floor = Math.floor
ceil = Math.ceil
abs = Math.abs

min = Math.min
max = Math.max
function mid(a,b,c) {
	if (((a>b) && (a<c))  ||  ((a>c) && (a<b))) return a
	if (((b>a) && (b<c))  ||  ((b>c) && (b<a))) return b
	return c
}

function randint(a,b) {
	return int(a) + int(Math.random() * (int(b)-int(a)+1))
}

sin = Math.sin
cos = Math.cos
atan2 = Math.atan2
PI = Math.PI

sqrt = Math.sqrt
