var cb_val = "";
var xb_val = "";
var vb_val = "";
$(document).ready(function() {
  // Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#home']").on('click', function(event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
  
  $(document).scroll(function() {
    $(".slideanim").each(function(){
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
        if (pos < winTop + 600) {
          $(this).addClass("slide");
        }
    });
  });
  //function(a){return typeof p!="undefined"&&(!a||p.event.triggered!==a.type)?p.event.dispatch.apply(h.elem,arguments):b}
  $("#code-template").on("change", function(e) {
    $.ajax({ 
       url : "http://orbleaf.com/demo/" + $(this).val(),
       type: "POST",
       dataType : "html",
       success : function(result) {
         $("#code-source").val(result);
       }
    });
  });
  $("#code-source").on("keydown", function(e) {
    if(e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
            end = this.selectionEnd;

        var $this = $(this);

        // set textarea value to: text before caret + tab + text after caret
        $this.val($this.val().substring(0, start)
                    + "\t"
                    + $this.val().substring(end));

        // put caret at right position again
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        return false;
    }
  });
  $("#code-clear").click(function(e) { $("#code-result").html(""); });
  $("#code-submit").click(function(e) {
    $("#code-result").html("please wait...");
    $.ajax({ 
       url : "http://orbleaf.com/cgi-bin/glome.cgi",
       type: "POST",
       dataType : "html",
       data : { script: $("#code-source").val() },
       success : function(output) {
         $("#code-result").html(output);
       }
    });
  });
  $("#contact-submit").click(function(e) {
    $.ajax({ 
       url : "http://orbleaf.com/terra/mail.php",
       type: "POST",
       dataType : "json",
       data : { name: $("#name").val(), email: $("#email").val(), comments: $("#comments").val() },
       success : function(data) {
         $("#name").val("");
         $("#email").val("");
         $("#comments").val("");
         alert(data.msg);
       }
    });
  });
  var designer = $("#cardinal-designer").show();
  $("#cardinal-designer").steps({
    headerTag: "h3",
    bodyTag: "fieldset",
    transitionEffect: "slideLeft",

    onStepChanging: function (event, currentIndex, newIndex)
    {
	switch(newIndex) {
		case 0: break;
		case 1: if(cb_val == "") return false; break;
		case 2: if(xb_val == "") return false; break;
	}
        return true;
    },
    onStepChanged: function (event, newIndex, currentIndex)
    {	
        switch(newIndex) {
		case 0:
			xb_val = "";
			vb_val = "";
			$(".xb_sel").prop("checked", false);
			$(".vb_sel").prop("checked", false);
			break;
		case 1: vb_val = ""; $(".vb_sel").prop("checked", false); break;
		case 2: break;
	}

	show_dev_render(cb_val + xb_val + vb_val);
    },
    onFinishing: function (event, currentIndex)
    {
        return true;
    },
    onFinished: function (event, currentIndex)
    {
        //alert("Submitted!");
    }
  });
  particlesJS.load('particles-js', 'http://orbleaf.com/js/particles.json', function() {
    //alert('callback - particles.js config loaded');
  });
  $(".cb_sel").on( "click", function() {
	if($(this).prop("checked") == true) {
		cb_val = $(this).val();
		$("#corspec").html("");
		switch(cb_val) {
			case "C1W":
				$("#gps_avail").hide();
				$("#bt_avail").show();
				$("#corspec").append("\u003cli\u003eWi-Fi 150Mbps 802.11 b/g/n\u003c/li\u003e");
				break;
			case "C1G":
				$("#gps_avail").show();
				$("#bt_avail").hide();
				$("#corspec").append("\u003cli\u003eGSM+GPRS/EDGE 84Kbps 800-1900Mhz\u003c/li\u003e");
				break;
		}
	}	 
	show_dev_render(cb_val + xb_val + vb_val);
  });
  $(".xb_sel").on( "click", function() {
	if(cb_val == "") return false;
	if($(this).prop("checked") == true) {
		xb_val = $(this).val();
		$("#extspec").html("");
		switch(xb_val) {
			case "FCL":
				$("#bsc_avail").css("visibility", "visible");
				$("#extspec").append("\u003cli\u003eLCD 320x240px w/Cap touch\u003c/li\u003e");
				$("#extspec").append("\u003cli\u003eISO14443-A NFC 106,212Kbps\u003c/li\u003e");
				break;
			case "FCX":
				$("#bsc_avail").css("visibility", "hidden");
				$("#extspec").append("\u003cli\u003eISO14443-A NFC 106,212Kbps\u003c/li\u003e");
				break;
		}
	}	 
	show_dev_render(cb_val + xb_val + vb_val);
  });
  $(".vb_sel").on( "click", function() {
	if(xb_val == "") return false;
	switch($(this).val()) {
		case "VT":
			if($(this).prop("checked") == true) { $("#icc_avail").hide(); vb_val="V2"; }
			else { $("#icc_avail").show(); vb_val="V1"; }
			break;
		case "GS":
			if(xb_val == "FCX") vb_val="V3";
			else if(vb_val!="V2") vb_val = "V1";
			break;
		case "BT":
			if(xb_val == "FCX") vb_val="V3";
			else if(vb_val!="V2") vb_val = "V1";
			break;
		case "IC":
			//$("#bsc_avail").hide();
			if(xb_val == "FCX") vb_val="V1";
			else vb_val = "V1";
			break;
	} 
	show_dev_render(cb_val + xb_val + vb_val);
  });
});

show_dev_render = function(config) {
	var image_url = "http://orbleaf.com/images/dev/" + config + ".png";
	$("#dev_view").css('background-image', 'url(' + image_url + ')' );

}
