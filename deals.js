$(document).ready(function(){
    var url = "https://api.flickr.com/services/feeds/photos_public.gne?" +
        "id=188106189@N08&format=json&jsoncallback=?";
    $.getJSON(url, function(data){
        var html = "<table>";
        $.each(data.items, function(i, item){
            html += "<tr><a href= '" +item.media.m +
                "' data-lightbox='image' data-title='"+ item.title + "'>" +
                "<img src=" + item.media.m + "></a></tr>";
        });
        html += "</table>";
        $("#clearance").html(html);
    });


    // $('#img-ajax').bxSlider({
    //
    // });

    var tempHtml= "<div><table class=\"table-design\">";
    $.getJSON("dealItems.json", function(data){
        $.each(data, function() {
            tempHtml += "<tr>"
            $.each(this, function (k, v) {
                tempHtml +=
                    "<td><img src='" + v.img_src + "' alt='" + v.item_name + "' width='156' height='150'/>" +
                    "</td>";
            });
            tempHtml += "</tr><tr>";
            $.each(this, function (k, v) {
                tempHtml +=
                    "<td class=\"table-caption\">" + v.item_name +
                    "</td>";
            });
            tempHtml += "</tr><tr>";
            $.each(this, function (k, v) {
                tempHtml +=
                    "<td class=\"table-caption\">" + v.sales_description +
                    "</td>";
            });
            tempHtml+= "</tr>";
        });
        tempHtml+="</table></div>";
        $("#img-ajax").html(tempHtml);
    });
    // $('#datepicker').attr('stylesheet').value = "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
    $( "#datepicker" ).datepicker({
        endDate: new Date(),
    });


});

function validateSubForm(){
    alert("You have successfully subscribed to the deals!");
}