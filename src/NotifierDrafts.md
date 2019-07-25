# Some drafts on notification mechanism

Apparently, it is not that easy to make notification mechanism in Chrome. 
The problem is that INIS website checks Referer to match their website, but it is impossible to set proper Referer from extension requests either with jQuery AJAX or fetch, due to security reasons. 
The only solution is to click "Search" button using jQuery and monitor changing results, but this is messy. 

These are drafts of what I have written and abandoned:

## Content.js

// Inject auto-notifier to run in the page context
let autoNotifierScript = document.createElement("script");
autoNotifierScript.src = "chrome-extension://dlnehfkmlledildjhfehjmooghafmicj/src/notifier/notifier.js";
autoNotifierScript.id = "notifier";
document.body.append(autoNotifierScript);

// Wait for injected notifier script to load
await new Promise(function(resolve) {
    function tick()
    {
        if (autoNotifierScript.getAttribute("data-overriden") === "true")
        {
            resolve();
        } else {
            setTimeout(tick, 250);
        }
    }
    
    tick();
});

## Notifier.js

// Override function

const storageKey = "latestSlots";

function getLatestSlots()
{
    return window.localStorage.getItem(storageKey);
}

function setLatestSlots(slots)
{
    window.localStorage.setItem(storageKey, slots);
}

function onChange(slots)
{
    alert("New slots!", slots);
}

function getEarliestApps() {
	$("#dvAppOptions").hide();
	$("#dvSubmitContent").hide();
	var sCat = "cat=" + $('#Category').val();
	var sSCat = "&sbcat=All" //+ $('#SubCategory').val();
	var sTyp = "&typ=" + $('#ConfirmGNIB').val();
	var sK = "&k=" + $('#k').val();
	var sP = "&p=" + $('#p').val();
	if (isValidForm()) {
		disableFlds(false);
		var dataThis = sCat + sSCat + sTyp + sK + sP;
		$('#btSrch4Apps').prop('disabled', true);
		var html = $
		.ajax( {
			dataType : "json",
			cache : false,
			type : "GET",
			url :   "/" + stPath + "/(getAppsNear)?readform",
			data : dataThis,
			async : true,
			success : function(data) {
				if (!(data.error === undefined || data.error === null)) {
					$("#valErrDateSearch").html("<span class=\"appOpMsg\">" + data.error + "</span>");
					$("#valErrDateSearch").show();
					$('#btSrch4Apps').prop('disabled', false);
					return;
				}

				$("#dvAppOptions").show();
				$("#valErrDateSearch").hide();
				if (!(data.empty === undefined || data.empty === null)) {
					$("#dvAppOptions")
					.html(
					"<table class=\"table\"><tr><td></td><td>No appointment(s) are currently available</td></tr></table>");
					$('#btSrch4Apps').prop('disabled', false);
				} else {
                    var realSlots;

					if (data.slots[0] == "empty") {
                        realSlots = [];

						$("#dvAppOptions")
						.html(
						"<table class=\"table\"><tr><td></td><td>No appointment(s) are currently available</td></tr></table>");
						$('#btSrch4Apps').prop('disabled', false);
					} else {
                        realSlots = data.slots.map(s => s.time).sort();

						var sTmp = '';
						for (i = 0; i < data.slots.length; i++) {
							sTmp += '<div id="rw'
								+ data.slots[i].id
								+ '" class="appOption"><table class="table"><tr><td id="td'
								+ data.slots[i].id
								+ '"><button type="button" class="btn btn-success" onclick="bookit(\''
								+ data.slots[i].id
								+ '\')">Book This</button></td><td>'
								+ data.slots[i].time
								sTmp += '</td></tr></table></div>'
								$('#btSrch4Apps').prop('disabled', false);
						}
						
						$('#btSrch4Apps').prop('disabled', false);
						$("#dvAppOptions").html(sTmp);
                    }

                    var latestSlots = getLatestSlots();
                    if (!latestSlots)
                    {
                        setLatestSlots(JSON.stringify(realSlots));
                    } else {
                        if (latestSlots !== JSON.stringify(realSlots))
                        {
                            setLatestSlots(JSON.stringify(realSlots));
                            onChange(realSlots);
                        }
                    }
				}
			}
		}).responseText;
	}
}

$("#notifier").attr("data-overriden", "true");