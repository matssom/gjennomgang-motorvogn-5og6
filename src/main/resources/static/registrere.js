/** onload function -> Runs when the webpage is ready to be manipulated */
$(function(){
    hentAlleBiler();
});

let cars = [];              // Stores all cars so that we can use them for both merke and type

/** Fetches all cars (models+types) from server */
function hentAlleBiler() {
    $.get( "/hentBiler", function( biler ) {
        cars = biler;
        formaterMerke(biler);
    });
}

/** Formats merke */
function formaterMerke(biler){
    let merkeList = [];                         // Using array (instead of forrige_merke, as in motorvogn3.zip solution)
                                                // to handle Biler regardless of registration order in array on server

    let ut = "<select id='merke' onchange='formaterTyper()'>";
    ut+="<option>--Velg merke--</option>";
    for (const bil of biler){
        if(!merkeList.includes(bil.merke)){
            ut+="<option>"+bil.merke+"</option>";
        }
        merkeList.push(bil.merke);
    }
    ut+="</select>";
    $("#merke-div").html(ut);
}

/** Formats car types */
function formaterTyper(){
    const valgtMerke = $("#merke").val();
    let ut = "<select id='type'>";
    ut+="<option>--Velg type--</option>";
    for(const bil of cars ){
        if(bil.merke === valgtMerke){
            ut+="<option>"+bil.type+"</option>";
        }
    }
    ut+="</select>";
    $("#type-div").html(ut);
}

/**
 * Checks if information inserted by user is valid and inserts error message when necessary
 * @param   {string}    data    Value fetched from input.
 * @param   {string}    felt    Name of field (capitalised, as necessary, for error message). Error div/span-id should match "[felt]-error" pattern, all lower case.
 */
function sjekkGyldig(data, felt){
    // A couple of variables to avoid repetition
    const felt_lc = felt.toLowerCase();
    const error = "#"+felt_lc+"-error"

    if (data === ""){
        $(error).html(felt + " må fylles.");
        return false;
    }
    if (data === ("--Velg " + felt_lc + "--")){
        $(error).html("Må velge en " + felt_lc + ".");
        return false;
    }

    $(error).html("");
    return true;            // No need for "else" because this line will only be reached if all is good.
}

/** Entry registration
 *  Checks for errors in user input and performs get request if all is good.
 */
function regMotorvogn() {
    const pnr = $("#personnr").val();
    const nvn = $("#navn").val();
    const add = $("#adresse").val();
    const kjt = $("#kjennetegn").val();
    const mrk = $("#merke").val();
    const typ = $("#type").val();

    // Did you know you can do maths with boolean values? True = 1; False = 0.
    // If any of the fields is false, it will be a multiplication by 0. Therefore the result is 0 = false.
    let riktig = sjekkGyldig(pnr, "Personnummer") *  sjekkGyldig(nvn, "Navn") *  sjekkGyldig(add, "Adresse") *  sjekkGyldig(kjt, "Kjennetegn") *  sjekkGyldig(mrk, "Merke") *  sjekkGyldig(typ, "Type");

    if (riktig){
        const motorvogn = {
            personnr : pnr,
            navn : nvn,
            adresse : add,
            kjennetegn : kjt,
            merke : mrk,
            type : typ,
        };
        $.post("/lagre", motorvogn, function(){

        });
        window.location.href="/"
    }
}