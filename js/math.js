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

random = Math.random
function rnd(a,b) {
	return a + int(random() * (b-a+1))
}

sin = Math.sin
cos = Math.cos
atan2 = Math.atan2
PI = Math.PI

sqrt = Math.sqrt
