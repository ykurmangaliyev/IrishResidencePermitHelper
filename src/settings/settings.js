async function fill()
{
    let data = await getIRPDataAsync();

    if (!data)
        return;

    $("#salutation").val(data.salutation);
    $("#firstName").val(data.firstName);
    $("#lastName").val(data.lastName);

    if (data.irp && data.irp.length)
    {
        $("#irp").val(data.irp);

        if (data.irpExpiry)
        {
            let irpExpiryMoment = moment(data.irpExpiry, "DD/MM/YYYY");
            $("#irpExpiryD").val(irpExpiryMoment.format("DD"));
            $("#irpExpiryM").val(irpExpiryMoment.format("MM"));
            $("#irpExpiryY").val(irpExpiryMoment.format("YYYY"));
        }

        $("#irpExpiryBlock").show();
    }

    if (data.dob)
    {
        let dobMoment = moment(data.dob, "DD/MM/YYYY");
        $("#dobD").val(dobMoment.format("DD"));
        $("#dobM").val(dobMoment.format("MM"));
        $("#dobY").val(dobMoment.format("YYYY"));
    }

    $("#nationality").val(data.nationality);
    $("#email").val(data.email);
    $("#people").val(data.people);
    $("#passport").val(data.passport);
}

async function save()
{
    let data = {
        salutation: $("#salutation").val(),
        firstName: $("#firstName").val().trim(),
        lastName: $("#lastName").val().trim(),
        nationality: $("#nationality").val(),
        email: $("#email").val().trim(),
        people: Math.min(10, Math.max(1, +$("#people").val())),
        passport: $("#passport").val().trim(),
        irp: $("#irp").val().trim()
    };

    if (data.irp && data.irp.length)
    {
        let irpExpiryMoment = moment([+$("#irpExpiryY").val(), $("#irpExpiryM").val() - 1, +$("#irpExpiryD").val()]);
        if (irpExpiryMoment.isValid())
        {
            data.irpExpiry = irpExpiryMoment.format("DD/MM/YYYY");
        }
    }

    let dobMoment = moment([+$("#dobY").val(), $("#dobM").val() - 1, +$("#dobD").val()]);
    if (dobMoment.isValid())
    {
        data.dob = dobMoment.format("DD/MM/YYYY");
    }

    await setIRPDataAsync(data);

    window.close();
}

$("#irp").on("input", function() { $("#irpExpiryBlock").toggle(!!(this.value && this.value.length)); });

$(document).ready(fill);
$("button").click(save);