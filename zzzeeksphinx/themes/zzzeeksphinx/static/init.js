
function initSQLPopups() {
    $('div.popup_sql').hide();
    $('a.sql_link').click(function() {
        $(this).nextAll('div.popup_sql:first').toggle();
        return false;
    });
}

function initFloatyThings() {

    var automatedBreakpoint = $("#docs-container").position().top +
        $("#docs-top-navigation-container").height();

    left = $("#fixed-sidebar.withsidebar").offset();
    if (left) {
        left = left.left;
    } // otherwise might be undefined

    // we use a "fixed" positioning for the sidebar regardless
    // of whether or not we are moving with the page or not because
    // we want it to have an independently-moving scrollbar at all
    // times.  Otherwise, keeping it with plain positioning before the
    // page has scrolled works more smoothly on safari, IE
    $("#fixed-sidebar.withsidebar").addClass("preautomated");

    function setScroll() {
        var scrolltop = $(window).scrollTop();
        if (scrolltop < 0) {
            // safari does this
            $("#fixed-sidebar.withsidebar").css(
                "top", $("#docs-body").offset().top - scrolltop);
        }
        else if (scrolltop >= automatedBreakpoint) {
            $("#fixed-sidebar.withsidebar").css("top", 5);
        }
        else {
          $("#fixed-sidebar.withsidebar").css(
                "top", $("#docs-body").offset().top - Math.max(scrolltop, 0));
        }

        var scrollside = $(window).scrollLeft();
        // more safari crap, side scrolling
        $("#fixed-sidebar.withsidebar").css("left", left - scrollside);
    }
    $(window).scroll(setScroll);

    setScroll();
}

function highlightLinks() {
    function bisection(x){
      var low = 0;
      var high = divCollection.length;

      var mid;

      while (low < high) {
        mid = (low + high) >> 1;

        if (x < divCollection[mid]['active']) {
          high = mid;
        } else {
          low = mid + 1;
        }
      }

      return low;
    }

    var divCollection = [];
    var currentIdx = -1;
    var docHeight = $(document).height();
    $("div.section").each(function(index) {
        var active = $(this).offset().top - 20;
        divCollection.push({
            'id': this.id,
            'active': active,
        });
    });

    function setLink() {
        var windowPos = $(window).scrollTop();
        var windowHeight = $(window).height();

        var idx;
        if (windowPos + windowHeight == docHeight) {
            idx = divCollection.length;
        }
        else {
            idx = bisection(windowPos);
        }

        if (idx != currentIdx) {
            //console.debug("got idx: " + idx);
            var effectiveIdx = Math.max(0, idx - 1);
            currentIdx = idx;

            var ref;
            if (effectiveIdx == 0) {
                ref = '';
            }
            else {
                ref = divCollection[effectiveIdx]['id'];
            }
            console.debug("link: " + ref);

            $("#docs-sidebar li a.reference").parent("li").removeClass('current');
            $("#docs-sidebar li a.reference[href='#" + ref + "']").parent("li").addClass('current');
        }
    }
    $(window).scroll(setLink);

    setLink();
}


$(document).ready(function() {
    initSQLPopups();
    if (!$.browser.mobile) {
        initFloatyThings();
        highlightLinks();
    }
});

