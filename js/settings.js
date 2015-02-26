
// --------------------------------------------------------------------
// Handle the Settings dialog closed event.
// event = System.Gadget.Settings.ClosingEvent argument.
// --------------------------------------------------------------------
System.Gadget.onSettingsClosed = SettingsClosed;

function getVal()
{
	if(System.Gadget.Settings.read("matchsel") == 0 || System.Gadget.Settings.read("matchsel") == 1)
	{
	matchid.selectedIndex=System.Gadget.Settings.read("matchsel");
	}
	if(System.Gadget.Settings.read("soundgadget") == 1) 
	{
	document.getElementById('soundtoggle').checked = true;
	}
	else if(System.Gadget.Settings.read("soundgadget") == 0)
	{
		document.getElementById('soundtoggle').checked = false;
	}
	if(System.Gadget.Settings.read("only1match") == 1)
	{
	matchid.disabled = true;
	}
	
	
}
function SettingsClosed(event)
{
    // User hits OK on the settings page.
    if (event.closeAction == event.Action.commit)
    {
        
    }
    // User hits Cancel on the settings page.
    else if (event.closeAction == event.Action.cancel)
    {
        
    }
}
System.Gadget.onSettingsClosing = SettingsClosing;
function SettingsClosing(event)
{
    // Save the settings if the user clicked OK.
    if (event.closeAction == event.Action.commit)
    {
        System.Gadget.Settings.write("matchsel",matchid.selectedIndex);
		
		if(document.getElementById('soundtoggle').checked)
		{
			System.Gadget.Settings.write("soundgadget",1);
		}
		else
		{
			System.Gadget.Settings.write("soundgadget",0);
		}
		System.Gadget.Settings.write("sound1","novalue");
		System.Gadget.Settings.write("sound2","novalue");
		System.Gadget.Settings.write("sound3","novalue");
		System.Gadget.Settings.write("sound4","novalue");
		System.Gadget.Settings.write("sound5","novalue");
		System.Gadget.Settings.write("sound6","novalue");
    }
    // Allow the Settings dialog to close.
    event.cancel = false;
}