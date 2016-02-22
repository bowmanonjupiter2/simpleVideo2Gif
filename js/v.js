
	var CAMERA = document.getElementById("camV");
	var CANVAS = document.getElementById("gifCanvas");

	var CAPTURE_TIMER = 200;
	var CAPTURE_TOTAL = 60;
	var GIF_DELAY = 200;
	
	var _GIFEncoder = null;
	var _captureCache = null;

	var _result = "";
	var _replayTimer = 0;
	var _cCounter = 0;	

	var _onSucc = function(stream){
		    CAMERA.src = window.URL.createObjectURL(stream);
	}

	var _onError = function(error){
		    console.log("unsupported stream", error);
	}

	function start(){
		navigator.webkitGetUserMedia({video:true}, _onSucc, _onError);
	}

	function stop(){
		CAMERA.pause();
		CAMERA.src="";
	}

	function capture(){
		_result = "";
		_captureCache = [];
		_cCounter = 0;

		_GIFEncoder = new GIFEncoder();
		_GIFEncoder.setRepeat(0);
		_GIFEncoder.setDelay(GIF_DELAY);
		_GIFEncoder.start();		

		_capture2Cache();

	}

	function _capture2Cache(){

		if(_cCounter < CAPTURE_TOTAL){
			_pushCache();
			_cCounter ++;
			setTimeout(_capture2Cache,CAPTURE_TIMER);			
		}

	}

	function _pushCache(){

		var _context = CANVAS.getContext("2d");
		_context.drawImage(CAMERA,0,0,CANVAS.clientWidth,CANVAS.clientHeight);
		_captureCache[_cCounter] = _context.getImageData(0,0,CANVAS.clientWidth,CANVAS.clientHeight).data;

		if(_cCounter == CAPTURE_TOTAL - 1){
			_encodeGif(_captureCache);
		}
	}
	function _encodeGif(_captureCache){

		_GIFEncoder.setSize(CANVAS.clientWidth,CANVAS.clientHeight);

		var i =0;
		for (; i < _captureCache.length ; i++){
			_GIFEncoder.addFrame(_captureCache[i], true);
			
		}
		_finishEncode();
	}

	function _finishEncode(){
		_GIFEncoder.finish();
		var binary_gif = _GIFEncoder.stream().getData();
		_result = 'data:image/gif;base64,'+encode64(binary_gif);
		_GIFEncoder = null;
		document.getElementById("result").innerHTML = '<img id="_result_img" src="'+_result+'"/>';
	}	
