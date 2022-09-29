var $fileInput = document.getElementById('fileInput')
var $fileList = document.getElementById('fileList')

$fileInput.addEventListener('change', function() {
	// When the value of $fileInput is changed, do whatever we're doing to process them
  // (adding to a list, uploading asyncronously, etc.)
  // In this situation, we're simply appending their names to a HTML list.
  for(var file of this.files) {
  	var $li = document.createElement('li')
    $li.innerText = file.name
    $fileList.appendChild($li)
  }

  // Reset the value of $fileInput by setting it to an empty string.
  // Note that this is the only write action permitted on a file input's value,
  // otherwise it is read only
	this.value = ''
})
