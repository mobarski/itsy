
// DOC: https://www.w3schools.com/xml/ajax_xmlhttprequest_create.asp

// TODO error handling
function api_get(url,fun) {
	var req = new XMLHttpRequest()

	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText)
			fun(data)
		}
	}
	req.open("GET", url, true)
	req.send()
}

// TODO error handling
function api_post(url,data,fun) {
	var req = new XMLHttpRequest()

	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var data = JSON.parse(this.responseText)
			fun(data)
		}
	}
	req.open("POST", url, true)
	req.send(JSON.stringify(data))
}
