function setField(selector, value)
{
    let $item = $(selector);

    $item.val(value);

    // jQuery .trigger() not working in content scripts due to sandboxing
    // https://stackoverflow.com/questions/17819344/triggering-a-click-event-from-content-script-chrome-extension/27753239
    $(selector)[0].dispatchEvent(new Event('change')); 
}

async function run()
{
    let data = await getIRPDataAsync();
    
    if (!data)
        return;

    // Set fields
    setField("#Category", "All");
    setField("#SubCategory", "All");

    if (data.irp && data.irp.length)
    {
        setField("#ConfirmGNIB", "Renewal");
        setField("#GNIBNo", data.irp);
        setField("#GNIBExDT", data.irpExpiry);
    } else {
        setField("#ConfirmGNIB", "New");
    }

    $("#UsrDeclaration").prop("checked", true);

    setField("#Salutation", data.salutation || '');
    setField("#GivenName", data.firstName);
    setField("#SurName", data.lastName);
    setField("#DOB", data.dob);
    setField("#Nationality", data.nationality);
    setField("#Email", data.email);
    setField("#EmailConfirm", data.email);
    
    if (data.people === 1)
    {
        setField("#FamAppYN", "No");
    } else {
        setField("#FamAppYN", "Yes");
        setField("#FamAppNo", data.people);
    }

    setField("#PPNoYN", "Yes");
    setField("#PPNo", data.passport);
    
    $("#btLook4App").click();

    setField("#AppSelectChoice", "S");

    $("#btSrch4Apps").click();

    // Add alert
    $("<div/>").html("<h3>Almost ready to book</h3>Next steps: <ul><li>You <b>must</b> verify all details on the form</li><li>Click 'Book This' on a chosen slot</li><li>Complete reCAPTCHA</li><li>Click 'Submit'</li></ul><br/>Thank you for using <a href='https://github.com/ykurmangaliyev/IrishResidencePermitHelper'>IRP helper extension</a>").prependTo("#recaptcha"); // alert!

    // Scroll to end
    window.scrollTo(0, document.body.scrollHeight);

    console.debug("IRP data is filled in with Irish Residence Permit helper extension: https://github.com/ykurmangaliyev/IrishResidencePermitHelper");
}

$(window).on("load", run);