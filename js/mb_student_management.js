var loading = '<span class="dashicons dashicons-admin-generic mb_spin loading" style="display: none;"></span>';
var success = '<span class="dashicons dashicons-yes success" style="display: none;"></span>';
var ajax_status = 'active';
var rand = '';
var selector = '';
var mb_table = '';
var mb_table = jQuery('#main_table').DataTable({
    "paging": true,
     "aoColumnDefs": [
        { "bSortable": false, "aTargets": [ 1] },
        { "bSortable": false, "aTargets": [ 6 ] }
      ],
      scrollX:        true,
      scrollCollapse: true,
      columnDefs: [
            { width: '20%', targets: 0 }
      ],
      fixedColumns: true,
      dom: 'Bfrtip',
        buttons: [
            'csv', 'print'
        ],
    initComplete: function () {
        this.api().columns('.select-filter').every( function () {
            var column = this;
            var select = jQuery('<select class="filter_option_dropdown"><option value=""></option></select>')
                .appendTo( jQuery(column.footer()).empty() )
                .on( 'change', function () {
                    var val = jQuery.fn.dataTable.util.escapeRegex(
                        jQuery(this).val()
                    );

                    column
                        .search( val ? '^'+val+'$' : '', true, false )
                        .draw();
                } );

            column.data().unique().sort().each( function ( d, j ) {
                select.append( '<option value="'+d+'">'+d+'</option>' )
            } );
        } );
    }

});

function reg_type_display() {
    jQuery('.if_reg_type').fadeOut();
    current_value = jQuery('#reg-type').val();
    if (current_value == 'event') {
      jQuery('.if_event').delay(400).fadeIn();
    }
    else if (current_value == 'sub') {
      jQuery('.if_sub').delay(400).fadeIn();
    }
    else if (current_value == 'other') {
      jQuery('.if_other').delay(400).fadeIn();
    }
    else if (current_value == 'referral') {
      jQuery('.if_referral').delay(400).fadeIn();
    }
}
function level_type_display(current_value, sum_num) {
    jQuery('.sum_level_other[sum-num="'+sum_num+'"]').fadeOut();
    if (current_value == 'other' || current_value =='foundation' 
      || current_value =='vocational' || current_value =='bachelor' 
      || current_value =='master' || current_value =='phd'){
      jQuery('.sum_level_other[sum-num="'+sum_num+'"]').delay(400).fadeIn();
    }
}

function edu_type_display(current_value, edu_num) {
    jQuery('.edu_level_other[edu-num="'+edu_num+'"]').fadeOut();
    jQuery('.edu_system[edu-num="'+edu_num+'"]').fadeOut();
    if (current_value == 'other' || current_value =='foundation' 
      || current_value =='vocational' || current_value =='bachelor' 
      || current_value =='master' || current_value =='phd') 
    {
      jQuery('.edu_level_other[edu-num="'+edu_num+'"]').delay(400).fadeIn();
    }
    else if (current_value == 'highschool') {
      jQuery('.edu_system[edu-num="'+edu_num+'"]').delay(400).fadeIn();
    }
}

function other_type_display(thisobj) {
  current_value = thisobj.val();
  if (current_value == 'other' || current_value == 'others') {
    thisobj.next().fadeIn();
  }
  else {
    thisobj.next().fadeOut();
  }
}

function installment_switcher(thisobj, status)
{
  jQuery('.mb_hide_this_please',thisobj.parent().parent().parent()).fadeToggle();
}

function installment_showbox(number, thisobj)
{
  var i = 0;
  jQuery('.installment_box.active',thisobj.parent().parent().parent().parent()).removeClass('active');
  jQuery('.installment_box',thisobj.parent().parent().parent().parent()).each(function(){
    if (i != number) {
      jQuery(this).addClass('active');
      i++;
    }
});
}

function test_passed(thisobj, status) {
    current_value = thisobj.attr('test-num');
    if (status == true || jQuery('.tests_outstanding_switch[test-num="'+current_value+'"]').is(':checked')) 
    {
      console.log(('.tests_outstanding_switch[test-num="'+current_value+'"]'));
      jQuery('.test_outstanding[test-num="'+current_value+'"]').fadeOut();
      jQuery('.test_passed[test-num="'+current_value+'"]').fadeIn();
     
    }
    else {
      jQuery('.test_outstanding[test-num="'+current_value+'"]').fadeIn();
      jQuery('.test_passed[test-num="'+current_value+'"]').fadeOut();
    }
}
function dual_type_display(status) {
    if (status == true || jQuery('#dual_nation').is(':checked')) {
      jQuery('.dual_country_parent').fadeIn();
    }
    else {
    jQuery('.dual_country_parent').fadeOut();
    }
}
function foreign_address(status) {
    if (status == true || jQuery('#post_same').is(':checked')) {
      jQuery('.foreign_address').fadeIn();
    }
    else {
    jQuery('.foreign_address').fadeOut();
    }
}

var current_date = '';
function delete_file(key, type, id, mainkey) {
      jQuery.ajax({
      url: ajax_params.ajax_url,
      data: {
          'action':'delete_file',
          'key' : key,
          'type' : type,
          'id' : id,
          'mainkey' : mainkey
      },
      success:function(data) {
                  jQuery('a[key="'+key+'"][mainkey="'+mainkey+'"').fadeOut();
                  jQuery('i[key="'+key+'"][mainkey="'+mainkey+'"').fadeOut();

      },
      error: function(errorThrown){
          console.log(errorThrown);
      }
  });
}
// Ready Function
jQuery(document).ready(function(){
 
jQuery('#upload_image_button').click(function() {
formfield = jQuery('#upload_image').attr('name');
tb_show('', 'media-upload.php?type=image&TB_iframe=true');
return false;
});

window.send_to_editor = function(html) {
imgurl = jQuery('img',html).attr('src');
jQuery('#upload_image').val(imgurl);
jQuery('#upload_image_button').css('background-image','url('+imgurl+')');
tb_remove();
}
jQuery('#update_student #surname').on('change keyup', function(){
  current_value = jQuery(this).val();
  jQuery('.top_surname').html(current_value);
});
jQuery('#update_student #given_name').on('change keyup', function(){
  current_value = jQuery(this).val();
  jQuery('.top_first_name').html(current_value);
});
jQuery('#amount_of_rows').prependTo('#main_table_filter');
jQuery('.dt-buttons').appendTo('h1.student_management');

jQuery('.sum_level').each(function(){
  var key = jQuery(this).attr('sum-num');
  var current_value = jQuery(this).val();
  level_type_display(current_value, key);
});
jQuery('#student, #update_student').on('change','.sum_level',function(){
  var sum_num = jQuery(this).attr('sum-num');
  var current_value = jQuery(this).val();
  level_type_display(current_value, sum_num);
});

jQuery('#student, #update_student').on('change','.edu_level',function(){
  var sum_num = jQuery(this).attr('edu-num');
  var current_value = jQuery(this).val();
  edu_type_display(current_value, sum_num);
});

jQuery(".delete_file").on('click',function(){
        var key = jQuery(this).attr('key');
        var mainkey = jQuery(this).attr('mainkey');
      var type = jQuery(this).attr('type');
      var id = jQuery(this).attr('id');
    if (confirm("Are you sure you want to delete this file?")) {
      delete_file(key, type, id, mainkey);
    }
});

// Graphs  
  jQuery('#container_3').highcharts({
        data: {
            table: 'number_of_students_each_year',
            useHTML: true

        },
        exporting: { enabled: false },
         chart: {
            type: 'bar',
            useHTML: true
        },
      plotOptions: {
          column: {colorByPoint: true,useHTML: true}
      },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Number of Students'
            },
        },
        xAxis: {
                     tickInterval:1
        },
        title: {
            text: 'Number of Students each year'
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    this.point.y + ' Students';
         }
      },
      legend: {
          enabled: false
        },
      credits: {
          enabled: false
      }

    });
    jQuery('#container_2').highcharts({
        data: {
            table: 'institution_number_of_students'
        },
         chart: {
            type: 'bar'
        },
        exporting: { enabled: false },
      plotOptions: {
          column: {colorByPoint: true,useHTML: true}
      },
        yAxis: {
            allowDecimals: false,
            title: {
                text: 'Number of Students'
            },
        },
        title: {
            text: 'Number of Students at each Institution'
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    this.point.y + ' Students';
         }
      },
      legend: {
          enabled: false
        },
      credits: {
          enabled: false
      }

    });
jQuery('#container_1').highcharts({
        data: {
            table: 'gender_table',
            useHTML: true,
        },
        chart: {
            type: 'pie',
            useHTML: true
        },
        exporting: { enabled: false },
        plotOptions: {
            column: {colorByPoint: true,useHTML: true}
        },
        title: {
            text: 'Total Number of Students'
        },
         credits: {
            enabled: false
        },

        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    this.point.y + ' ' + this.point.name;
         }
     } });
       
  jQuery( ".test_pref_parent" ).on('change','.tests_outstanding_switch',function() {
    test_passed(jQuery(this),this.checked);
  });
  
  jQuery('.tests_outstanding_switch').each(function(){
        test_passed(jQuery(this),this.checked);
  });

  jQuery(".sum_pref_parent").on('change', '.installment_switch' ,function(){
    installment_switcher(jQuery(this),this.checked);
  });

  jQuery('.sum_pref_parent').on('change','.installment_number',function(){
      var number = jQuery(this).val();
      installment_showbox(number,jQuery(this));
  });

  jQuery('.visa_status, .edu_status').each(function(){
    other_type_display(jQuery(this));
  });
  jQuery('.visa_pref_parent').on('change','.visa_status', function(){
    other_type_display(jQuery(this));
});
    jQuery('.edu_pref_parent').on('change','.edu_status', function(){
    other_type_display(jQuery(this));
});
  jQuery('.add_course_pref i').on('click',function(){
    var course_number = jQuery(this).attr('course-num');
    if (course_number) {
      current_total_count = jQuery('.number_of_elements.course_preference').html();
      if(typeof current_total_count !== "undefined") {
      current_total_count = current_total_count.replace("(", "");
      current_total_count = current_total_count.replace(")", "");
      current_total_count_num = parseInt(current_total_count) + 1;
      jQuery('.number_of_elements.course_preference').html("("+current_total_count_num+")");
      }
      course_number = parseInt(course_number, 10) + 1;

      jQuery('.course_pref_parent').append(
        '<div class="course_pref" course-num="'+course_number+'">'+
         '<div class="row">'+
              '<label class="col-md-2 control-label" for="course_pref">Course Name</label>'+  
                '<div class="col-md-4">'+
                '<input type="input" class="form-control input-md" id="course_pref" name="course_preference['+course_number+'][course_pref]" />'+
                '</div>'+
                '<label class="col-md-2 control-label" for="exp_date">Country Preference</label>'+  
                '<div class="col-md-4">'+
                '<select class="input-medium bfh-countries" data-country="AU" id="country_pref" name="course_preference['+course_number+'][country_pref]"></select>'+
                '</div>'+                            
          '</div>'+
          '<div class="row">'+
                  '<label class="col-md-2 control-label" for="exp_date">City Preference</label>'+  
                  '<div class="col-md-4">'+
                  '<input type="input" class="form-control input-md" id="city_pref" name="course_preference['+course_number+'][city_pref]" />'+
                  '</div>'+  
                '<label class="col-md-2 control-label" for="duration_pref">Duration</label>'+  
                  '<div class="col-md-3">'+
                  '<input type="input" class="form-control input-md" id="duration_pref" name="course_preference['+course_number+'][duration_pref]" />'+
                '</div>'+
                '<div class="col-md-1">'+
                '<select id="duration_pref_type" name="course_preference['+course_number+'][duration_pref_type]" class="form-control input-md">'+
                  '<option value="weeks">Weeks</option>'+
                  '<option value="months">Months</option>'+
                  '<option value="years">Years</option>'+
                '</select>'+
              '</div>'+
          '</div>'+
          '<div class="row delete_button"><center>'+
          '<button type="button" class="btn btn-danger animated delete_course" course-num="'+course_number+'">Delete this Course Preference</button></center><hr></div>'+
    '</div>');

      element = '.course_pref[course-num="'+course_number+'"] .bfh-countries';
      element_two = '.course_pref[course-num="'+course_number+'"]';
      jQuery(element).bfhcountries({country: 'AU'});
      jQuery(element_two).fadeIn();
      jQuery(this).attr('course-num',course_number);
    }
  });
  jQuery('.course_pref_parent').on('click','.delete_course',function(){
    current_number = jQuery(this).attr('course-num');
    current_total_count = jQuery('.number_of_elements.course_preference').html();
    if(typeof current_total_count !== "undefined") {
    current_total_count = current_total_count.replace("(", "");
    current_total_count = current_total_count.replace(")", "");
    current_total_count_num = parseInt(current_total_count) - 1;
    jQuery('.number_of_elements.course_preference').html("("+current_total_count_num+")");
    }
    element = '.course_pref[course-num="'+current_number+'"]';
    jQuery(element).fadeOut('slow', function() {
    jQuery(this).remove();
});
  });
    jQuery('.add_visa_pref i').on('click',function(){
    var course_number = jQuery(this).attr('visa-num');
    if (course_number) {
      current_total_count = jQuery('.number_of_elements.visa').html();
      if(typeof current_total_count !== "undefined") {
        current_total_count = current_total_count.replace("(", "");
        current_total_count = current_total_count.replace(")", "");
        current_total_count_num = parseInt(current_total_count) + 1;
        jQuery('.number_of_elements.visa').html("("+current_total_count_num+")");
      }
      course_number = parseInt(course_number, 10) + 1;

      jQuery('.visa_pref_parent').append(
      '<div class="visa_pref" visa-num="'+course_number+'">'+
         '<div class="row">'+
                '<label class="col-md-2 control-label" for="visa_pref">Visa Title</label>'+
                  '<div class="col-md-4">'+
                  '<input type="input" class="form-control input-md" id="visa_pref" name="visa['+course_number+'][title]" />'+
                  '</div>'+
                  '<label class="col-md-2 control-label" for="visa_status_pref">Visa Status</label>'+
                  '<div class="col-md-4">'+
                  '<select class="input-medium visa_status" id="visa_status_pref" name="visa['+course_number+'][status]">'+
                    '<option value="open">Open</option>'+
                    '<option value="approved">Approved</option>'+
                    '<option value="rejected">Rejected</option>'+
                    '<option value="cancelled">Cancelled</option>'+
                    '<option value="other">Other</option>'+                                   
                  '</select>'+
                  '<input type="input" class="form-control input-md input-medium visa_reason" name="visa['+course_number+'][reason]" placeholder="Other Reason"/>'+
                  '</div>'+                            
          '</div>'+
          '<div class="row">'+
                  '<label class="col-md-2 control-label" for="visa_country_pref">Issuing Country</label>'+ 
                  '<div class="col-md-4">'+
                  '<select class="input-medium bfh-countries" data-country="AU" id="visa_country_pref" name="visa['+course_number+'][country_pref]"></select>'+
                  '</div> '+
               '<label class="col-md-2 control-label" for="dob">Expiration Date</label>'+
          '<div class="col-md-4">'+
          '<input id="exp_date" name="visa['+course_number+'][exp_date]" type="text" placeholder="12/12/12" class="form-control input-md datepicker" readonly>'+
          '</div>'+
          '</div>'+
          '<div class="row">'+
          '<label class="col-md-2 control-label" for="app_date">Application Date</label> '+ 
          '<div class="col-md-4">'+
          '<input id="app_date" name="visa['+course_number+'][app_date]" type="text" placeholder="12/12/12" class="form-control input-md datepicker" readonly> '+
          '</div> '+
          '<label class="col-md-2 control-label" for="health_date">Health Check</label>'+
          '<div class="col-md-4">'+
          '<input id="health_date" name="visa['+course_number+'][health_date]" type="text" placeholder="12/12/12" class="form-control input-md datepicker" readonly>'+ 
          '</div>'+
          '</div>'+
         '<div class="row delete_button"><center>'+
         '<button type="button" class="btn btn-danger animated delete_visa" visa-num="0">Delete this Visa</button></center><hr></div>'+
    '</div>');

      element = '.visa_pref[visa-num="'+course_number+'"] .bfh-countries';
      element_two = '.visa_pref[visa-num="'+course_number+'"]';
      element_three = '.visa_pref[visa-num="'+course_number+'"] .datepicker';
      jQuery(element_three).datepicker({
          format: 'dd/mm/yyyy'
      });
      jQuery(element).bfhcountries({country: 'AU'});
      jQuery(element_two).fadeIn();
      jQuery(this).attr('visa-num',course_number);
    }
  });
    jQuery('.add_test_pref i').on('click',function(){
    var course_number = jQuery(this).attr('test-num');
    if (course_number) 
    {
      current_total_count = jQuery('.number_of_elements.tests').html();
      if (current_total_count == null) 
      {

      }
      else 
      {
        current_total_count = current_total_count.replace("(", "");
        current_total_count = current_total_count.replace(")", "");
        current_total_count_num = parseInt(current_total_count) + 1;
        jQuery('.number_of_elements.tests').html("("+current_total_count_num+")");
      }
      course_number = parseInt(course_number, 10) + 1;

      jQuery('.test_pref_parent').append(
        '<div class="test_pref" test-num="'+course_number+'">'+
        '<div class="row">'+
                '<label class="col-md-2 control-label" for="test_name">Test</label>'+ 
                  '<div class="col-md-4">'+
                   '<select class="form-control input-md" id="test_name" id="test_name" name="test['+course_number+'][name]" type="text" class="form-control" test-num='+course_number+'>'+
                      '<option value="ielts">IELTS</option><option value="toefl">TOEFL</option>'+
                      '<option value="peason">Peason</option>'+
                      '<option value="isat">ISAT</option>'+
                      '<option value="umat">UMAT</option>'+
                      '<option value="gmsat">GAMSAT</option>'+
                      '<option value="mcat">MCAT</option>'+
                      '<option value="other">Other</option>'+
                    '</select>'+
                  '</div>'+
                  '<label class="col-md-2 control-label" for="test_passed">Passed?</label>'+  
                  '<div class="col-md-4">'+
                  '<input type="checkbox" class="js-switch tests_outstanding_switch" id="post_same" test-num="'+course_number+'" name="test['+course_number+'][passed]"/>'+
                  '</div>'+                           
          '</div>'+
          '<div class="row">'+
              '<div class="test_outstanding" test-num="'+course_number+'">'+
                '<label class="col-md-2 control-label" for="exp_date">Tested Date</label>'+  
                  '<div class="col-md-4">'+
                    '<input id="exp_date" name="test['+course_number+'][exp_date]" type="text" placeholder="12/12/18" class="form-control input-md datepicker" readonly>'+ 
                  '</div>'+
                  '</div>'+
                '<div class="test_passed" test-num="'+course_number+'">'+
                 '<label class="col-md-2 control-label" for="test_date">Test Date</label>'+ 
                  '<div class="col-md-4">'+
                  '<input id="passed_date" name="test['+course_number+'][test_date]" type="text" placeholder="12/12/12" class="form-control input-md datepicker" readonly>'+
                  '</div>'+
                  '</div>'+
                '</div>'+                       
          '<div class="row">'+
          '<div class="test_passed" test-num="'+course_number+'">'+
                '<label class="col-md-2 control-label" for="passed_date">Result Date</label>'+
                  '<div class="col-md-4">'+
                      '<input id="passed_date" name="test['+course_number+'][passed_date]" type="text" placeholder="12/12/12" class="form-control input-md datepicker" readonly> '+
                  '</div>'+
               '<label class="col-md-2 control-label" for="test_score">Score</label>'+  
          '<div class="col-md-4">'+
          '<input id="test_score" name="test['+course_number+'][score]" type="text" class="form-control input-md">'+
          '</div>'+
          '</div>'+
          '<label class="col-md-2 control-label">Notifications</label><div class="col-md-4"><input type="checkbox" class="js-switch" test-num="'+course_number+'" name="test['+course_number+'][notifications_test]" checked/></div></div>'+
         '<div class="row delete_button"><center><button type="button" class="btn btn-danger animated delete_test" test-num="'+course_number+'">Delete this Test</button></center><hr></div>'+
    '</div>');

      element_two = '.test_pref[test-num="'+course_number+'"]';
      element_three = '.test_pref[test-num="'+course_number+'"] .datepicker';
      element_four = '.test_pref[test-num="'+course_number+'"] .js-switch';
      jQuery(element_three).datepicker({
          format: 'dd/mm/yyyy'
      });
      var elems = Array.prototype.slice.call(document.querySelectorAll(element_four));
      elems.forEach(function(html) {
        var switchery = new Switchery(html, { size: 'small'});
      });
      jQuery(element_two).fadeIn();
      jQuery(this).attr('test-num',course_number);
    }
  });
  jQuery('.add_work_pref i').on('click',function(){
    var course_number = jQuery(this).attr('work-num');
    if (course_number) {
       current_total_count = jQuery('.number_of_elements.work').html();
       if (current_total_count == null) 
      {

      }
      else 
      {
       current_total_count = current_total_count.replace("(", "");
        current_total_count = current_total_count.replace(")", "");
        current_total_count_num = parseInt(current_total_count) + 1;
        jQuery('.number_of_elements.work').html("("+current_total_count_num+")");
      }
      course_number = parseInt(course_number, 10) + 1;

      jQuery('.work_pref_parent').append(
        '<div class="work_pref" work-num="'+course_number+'">'+
           '<div class="row">'+
                  '<label class="col-md-2 control-label" for="work_history">Work History</label>'+
                    '<div class="col-md-4">'+
                    '<input id="work_history" name="work['+course_number+'][history]" type="text" class="form-control input-md">'+ 
                    '</div>'+
                    '<label class="col-md-2 control-label" for="work_duration">Duration (in months)</label>'+
                    '<div class="col-md-4">'+
                    '<input type="number" class="form-control" id="work_duration" name="work['+course_number+'][duration]"/>'+
                    '</div>'+                        
            '</div>'+
            '<div class="row">'+
                 '<label class="col-md-2 control-label">Exact Duration</label>'+
                    '<div class="col-md-4">'+
                      '<div class="input-group input-daterange">'+
                        '<input type="text" class="form-control datepicker" placeholder="12/12/12" name="work['+course_number+'][from]" readonly>'+
                        '<span class="input-group-addon">to</span>'+
                        '<input type="text" class="form-control datepicker" placeholder="12/12/12" name="work['+course_number+'][to]" readonly>'+
                      '</div>'+
                    '</div>'+
                  '</div>'+    
           '<div class="row delete_button"><center>'+
           '<button type="button" class="btn btn-danger animated delete_work" work-num="'+course_number+'">Delete this Work</button>'+
           '</center><hr></div>'+
      '</div>');

      element_two = '.work_pref[work-num="'+course_number+'"]';
      element_three = '.work_pref[work-num="'+course_number+'"] .datepicker';
      jQuery(element_three).datepicker({
          format: 'dd/mm/yyyy'
      });
      jQuery(element_two).fadeIn();
      jQuery(this).attr('work-num',course_number);
    }
  });

  jQuery('.visa_pref_parent').on('click','.delete_visa',function(){
    current_number = jQuery(this).attr('visa-num');
    current_total_count = jQuery('.number_of_elements.visa').html();
    if(typeof current_total_count !== "undefined") {
      current_total_count = current_total_count.replace("(", "");
      current_total_count = current_total_count.replace(")", "");
      current_total_count_num = parseInt(current_total_count) - 1;
      jQuery('.number_of_elements.visa').html("("+current_total_count_num+")");
    }
    element = '.visa_pref[visa-num="'+current_number+'"]';
    jQuery(element).fadeOut('slow', function() {
    jQuery(this).remove();
    });
  });
  jQuery('.test_pref_parent').on('click','.delete_test',function(){
    current_number = jQuery(this).attr('test-num');
    current_total_count = jQuery('.number_of_elements.tests').html();
    if(typeof current_total_count !== "undefined") {
      current_total_count = current_total_count.replace("(", "");
      current_total_count = current_total_count.replace(")", "");
      current_total_count_num = parseInt(current_total_count) - 1;
      jQuery('.number_of_elements.tests').html("("+current_total_count_num+")");
    } 
    element = '.test_pref[test-num="'+current_number+'"]';
    jQuery(element).fadeOut('slow', function() {
    jQuery(this).remove();
    });
  });
  jQuery('.work_pref_parent').on('click','.delete_work',function(){
    current_number = jQuery(this).attr('work-num');
    current_total_count = jQuery('.number_of_elements.work').html();
    if(typeof current_total_count !== "undefined") {
      current_total_count = current_total_count.replace("(", "");
      current_total_count = current_total_count.replace(")", "");
      current_total_count_num = parseInt(current_total_count) - 1;
      jQuery('.number_of_elements.work').html("("+current_total_count_num+")");
    }
    element = '.work_pref[work-num="'+current_number+'"]';
    jQuery(element).fadeOut('slow', function() {
    jQuery(this).remove();
    });
  });

  jQuery('.add_edu_pref i').on('click',function(){
    var course_number = jQuery(this).attr('edu-num');
    if (course_number) {

      current_total_count = jQuery('.number_of_elements.edu').html();
       current_total_count = jQuery('.number_of_elements.tests').html();
      if (current_total_count == null) 
      {

      }
      else 
      {
        current_total_count = current_total_count.replace("(", "");
        current_total_count = current_total_count.replace(")", "");
        current_total_count_num = parseInt(current_total_count) + 1;
        jQuery('.number_of_elements.edu').html("("+current_total_count_num+")");
      }
      course_number = parseInt(course_number, 10) + 1;
      jQuery('.edu_pref_parent').append(
      '<div class="edu_pref" edu-num="'+course_number+'">'+
             '<div class="row">'+
                '<label class="col-md-2 control-label" for="edu_country">Country</label>'+  
                  '<div class="col-md-4">'+
                  '<select class="input-medium bfh-countries" data-country="TH" id="edu_country" name="edu['+course_number+'][country]"></select>'+
                  '</div>'+
                  '<label class="col-md-2 control-label" for="edu_level">Level</label>'+
                  '<div class="col-md-4">'+
                  '<select id="level" name="edu['+course_number+'][level]" class="form-control edu_level" edu-num="'+course_number+'">'+
                    '<option value="highschool">School</option>'+
                    '<option value="english">English</option>'+
                    '<option value="foundation">Foundation</option>'+
                    '<option value="vocational">Vocational</option>'+
                    '<option value="bachelor">Bachelor</option>'+
                    '<option value="master">Master</option>'+
                    '<option value="phd">Ph.D</option>'+
                    '<option value="other">Others</option>'+
                   '</select>'+
                   '<input type="text" class="form-control edu_level_other" placeholder="Please specify" name="edu['+course_number+'][level_other]" edu-num="'+course_number+'">'+
                   '<input type="input" class="form-control input-md input-medium edu_others" name="edu['+course_number+'][lang_others]" placeholder="Other Language"/>'+
                '</div>'+                            
         '</div>'+
         '<div class="row">'+
         '<label class="col-md-2 control-label edu_system" for="edu_system" edu-num="'+course_number+'">Course</label>'+  
         '<div class="col-md-4">'+
         '<select class="input-medium edu_system" name="edu['+course_number+'][system]" edu-num="'+course_number+'">'+
            '<option value="p1">P1</option>'+
            '<option value="p2">P2</option>'+
            '<option value="p3">P3</option>'+
            '<option value="p4">P4</option>'+
            '<option value="p5">P5</option>'+
            '<option value="p6">P6</option>'+
            '<option value="m1">M1</option>'+
            '<option value="m2">M2</option>'+
            '<option value="m3">M3</option>'+
            '<option value="m4">M4</option>'+
            '<option value="m5">M5</option>'+
            '<option value="m6">M6</option>'+
            '<option value="1B">1B</option>'+
            '<option value="a">A level</option>'+
            '<option value="sat">SAT</option>'+
            '<option value="pvc">PVC</option>'+                                 
          '</select>'+
          '</div>'+
          '<div class="col-md-6"></div>'+
          '</div>'+
          '<div class="row">'+
          '<label class="col-md-2 control-label" for="schoolspec">Education Provider</label>'+  
          '<div class="col-md-4">'+
          '<input id="schoolspec" name="edu['+course_number+'][schoolspec]" type="text" class="form-control input-md">'+ 
          '</div>'+
          '<div class="col-md-6"></div>'+
          '</div>'+
          '<div class="row">'+
          '<label class="col-md-2 control-label" for="edu_lang">Language</label>'+  
          '<div class="col-md-4">'+
          '<select id="edu_lang" name="edu['+course_number+'][lang]" class="form-control input-md input-medium edu_status">'+
          '<option value="thai">Thai</option>'+
          '<option value="bi">Bi</option>'+
          '<option value="int">International</option>'+
          '<option value="others">Others</option>'+
          '</select>'+
          '</div> '+
          '<label class="col-md-2 control-label" for="edu_com">Completion Date</label>'+  
          '<div class="col-md-4">'+
          '<input id="completion_date" name="edu['+course_number+'][com]" type="text" placeholder="12/12/12" class="form-control input-md datepicker" readonly>'+ 
          '</div>'+
          '</div>'+
         '<div class="row delete_button"><center><button type="button" class="btn btn-danger animated delete_edu" edu-num="0">'+
         'Delete this Education Info</button></center><hr>'+
         '</div>'+
    '</div>');
      element = '.edu_pref[edu-num="'+course_number+'"] .bfh-countries';
      element_two = '.edu_pref[edu-num="'+course_number+'"]';
      element_three = '.edu_pref[edu-num="'+course_number+'"] .datepicker';
      jQuery(element).bfhcountries({country: 'TH'});
      jQuery(element_two).fadeIn();
      jQuery(element_three).datepicker({
          format: 'dd/mm/yyyy'
      });
      jQuery(this).attr('edu-num',course_number);
    }
  });

    jQuery('.add_app_pref i').on('click',function(){
    var course_number = jQuery(this).attr('app-num');
    if (course_number) {
      current_total_count = jQuery('.number_of_elements.app').html();
       if (current_total_count == null) 
      {

      }
      else 
      {
        current_total_count = current_total_count.replace("(", "");
        current_total_count = current_total_count.replace(")", "");
        current_total_count_num = parseInt(current_total_count) + 1;
        jQuery('.number_of_elements.app').html("("+current_total_count_num+")");
      }
      course_number = parseInt(course_number, 10) + 1;
      uni_list = jQuery('#the_uni_list').html();
      jQuery('.app_pref_parent').append(
      '<div class="app_pref" app-num="'+course_number+'">'+
       '<div class="row">'+
          '<label class="col-md-2 control-label" for="app_country">Country</label>'+  
          '<div class="col-md-4">'+
          '<select class="input-medium bfh-countries" data-country="AU" id="app_country" name="app['+course_number+'][country]"></select>'+
          '</div>'+
          '<label class="col-md-2 control-label" for="app_inst">Institution</label>'+
          '<div class="col-md-4">'+
          '<select class="form-control input-md" name="app['+course_number+'][inst]" class="form-control">'+
          uni_list+
          '</select>'+
          '</div>'+
        '</div>'+
        '<div class="row">'+
            '<label class="col-md-2 control-label">Application Date</label>'+ 
            '<div class="col-md-4">'+
            '<input type="text" class="form-control datepicker" placeholder="12/12/12" name="app['+course_number+'][applied_on]" readonly>'+
            '</div>'+
            '<label class="col-md-2 control-label" for="passed_date">Notifications</label>'+
             '<div class="col-md-4">'+
            '<input type="checkbox" class="js-switch" app-num="'+course_number+'" name="app['+course_number+'][notifications_application]" checked/></div>'+
            '</div><div class="row">'+
            '<label class="col-md-2 control-label">Offer Date</label>'+
            '<div class="col-md-4">'+
            '<input type="text" class="form-control datepicker" placeholder="12/12/12" name="app['+course_number+'][offered_on]" readonly>'+
            '</div>'+
        '<label class="col-md-2 control-label" for="passed_date">Notifications</label><div class="col-md-4"><input type="checkbox" class="js-switch" app-num="'+course_number+'" name="app['+course_number+'][notifications_offer]" checked/> </div></div>'+
        '<div class="row">'+
            '<label class="col-md-2 control-label">Payment Date</label>'+ 
              '<div class="col-md-4">'+
                '<input type="text" class="form-control datepicker" placeholder="12/12/12" name="app['+course_number+'][paid_on]" readonly>'+
              '</div>'+
              '<label class="col-md-2 control-label" for="passed_date">Notifications</label><div class="col-md-4"><input type="checkbox" class="js-switch" app-num="'+course_number+'" name="app['+course_number+'][notifications_payment]" checked/></div></div>'+
               '<div class="row">'+
              '<label class="col-md-2 control-label">eCOE Date</label>'+ 
              '<div class="col-md-4">'+
                '<input type="text" class="form-control datepicker" placeholder="12/12/12" name="app['+course_number+'][coe_on]" readonly>'+
              '</div><label class="col-md-2 control-label" for="passed_date">Notifications</label><div class="col-md-4"><input type="checkbox" class="js-switch" app-num="0" name="app['+course_number+'][notifications_coe]" checked/>'+
              '</div></div>'+
              '<div class="row">'+
              '<label class="col-md-2 control-label" for="passed_date">Documents</label>'+
              '<div class="col-md-4">'+
                '<input type="file" class="works_files" name="work['+course_number+'][files]" multiple>'+
              '</div>'+
        '</div>'+
       '<div class="row delete_button"><center>'+
       '<button type="button" class="btn btn-danger animated delete_app" app-num="'+course_number+'">Delete this Application</button>'+
       '</center><hr></div></div>');

      element = '.app_pref[app-num="'+course_number+'"] .bfh-countries';
      element_two = '.app_pref[app-num="'+course_number+'"]';
      jQuery(element).bfhcountries({country: 'AU'});
      element_three = '.app_pref[app-num="'+course_number+'"] .datepicker';
      jQuery(element_three).datepicker({
          format: 'dd/mm/yyyy'
      });
      element_four = '.app_pref[app-num="'+course_number+'"] .js-switch';
      elems = Array.prototype.slice.call(document.querySelectorAll(element_four));
      elems.forEach(function(html) {
        var switchery = new Switchery(html, { size: 'small'});
      });
      jQuery(element_two).fadeIn();
      jQuery(this).attr('app-num',course_number);
    }
  });

  jQuery('.app_pref_parent').on('click','.delete_app',function(){
    current_total_count = jQuery('.number_of_elements.app').html();
    if(typeof current_total_count !== "undefined") {
    current_total_count = current_total_count.replace("(", "");
    current_total_count = current_total_count.replace(")", "");
    current_total_count_num = parseInt(current_total_count) - 1;
        jQuery('.number_of_elements.app').html("("+current_total_count_num+")");
    }
    
    current_number = jQuery(this).attr('app-num');
    element = '.app_pref[app-num="'+current_number+'"]';
    jQuery(element).fadeOut('slow', function() {
    jQuery(this).remove();
    });
  });
   jQuery('.add_sum_pref i').on('click',function(){
    var course_number = jQuery(this).attr('sum-num');
     if (course_number) {
      current_total_count = jQuery('.number_of_elements.sum').html();
       if (current_total_count == null) 
      {

      }
      else 
      {
      current_total_count = current_total_count.replace("(", "");
      current_total_count = current_total_count.replace(")", "");
      current_total_count_num = parseInt(current_total_count) + 1;
       jQuery('.number_of_elements.sum').html("("+current_total_count_num+")");
    
    }
       course_number = parseInt(course_number, 10) + 1;
      uni_list = jQuery('#the_uni_list').html();
      jQuery('.sum_pref_parent').append('<div class="sum_pref" sum-num="'+course_number+'"> <div class="row"> <label class="col-md-2 control-label" for="sum_country">Country</label> <div class="col-md-4"> <select class="input-medium bfh-countries" id="app_country" name="sum['+course_number+'][country]" data-country="AU" ></select> </div> <label class="col-md-2 control-label" for="sum_inst">Institution</label> <div class="col-md-4"> <select id="level" name="sum['+course_number+'][inst]" id="sum_inst" class="form-control sum_level" sum-num="'+course_number+'"> '+uni_list+' </select> </div> </div> <div class="row"> <label class="col-md-2 control-label" for="sum_course">Course</label> <div class="col-md-4"> <input type="text" class="form-control" name="sum['+course_number+'][course]" id="sum_course"> </div> <label class="col-md-2 control-label">Duration (in months)</label> <div class="col-md-4"> <input type="text" class="form-control" name="sum['+course_number+'][course_duration]"> </div> </div> <div class="row"> <label class="col-md-2 control-label" for="sum_date">Start Date</label> <div class="col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][date]" readonly> </div> <label class="col-md-2 control-label" for="sum_date">End Date</label> <div class="col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][grad_date]" readonly> </div> </div> <div class="row"> <label class="col-md-2 control-label" for="sum_date">Departure Date</label> <div class="col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][departure_date]" readonly> </div> <label class="col-md-2 control-label" for="passed_date">Notifications</label> <div class="col-md-4"> <input type="checkbox" class="js-switch" app-num="0" name="sum['+course_number+'][notifications_departure]" checked/> </div> </div> <div class="row"> <label class="col-md-2 control-label" for="sum_date">Student ID</label> <div class="col-md-4"> <input type="text" class="form-control" placeholder="Student ID" name="sum['+course_number+'][student_id]"> </div> <label class="col-md-2 control-label" for="sum['+course_number+'][level]">Level</label> <div class="col-md-4"> <select id="level" name="sum['+course_number+'][level]" class="form-control sum_level" sum-num="'+course_number+'"> <option value="english">English</option> <option value="school">School</option> <option value="foundation">Foundation</option> <option value="vocational">Vocational</option> <option value="bachelor">Bachelor</option> <option value="master">Master</option> <option value="phd">Ph.D</option> <option value="other">Others</option> </select> <input type="text" class="form-control sum_level_other" placeholder="Please specify" name="sum['+course_number+'][level_other]" sum-num="'+course_number+'"> </div> </div> <br> <div class="row"><div class="col-md-2 control-label"><strong>Payment</strong></div><div class="col-md-10"></div></div> <div class="row"> <label class="col-md-2 control-label" for="sum_country">Currency</label> <div class="col-md-4"> <select class="input-medium bfh-countries" name="sum['+course_number+'][sum_currnency]" data-country="AU" ></select> </div> </div> <div class="row"> <label class="col-md-2 control-label">Deposit Fee </label> <div class="col-md-4"> <input type="number" class="form-control" name="sum['+course_number+'][deposit]"> </div> <label class="col-md-2 control-label">Annual Fee </label> <div class="col-md-4"> <input type="number" class="form-control" name="sum['+course_number+'][annual]"> </div> </div> <div class="row"> <label class="col-md-2 control-label">Paid Date</label> <div class="col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][main_paid_date]" readonly> </div> </div> <div class="row"> <label class="col-md-2 control-label">ACCOM BOOKING?</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][accom_date]" readonly> <input type="checkbox" class="js-switch" name="sum['+course_number+'][accom_booking]"/> </div> <label class="col-md-2 control-label">TICKET BOOKING?</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][ticket_booking_date]" readonly> <input type="checkbox" class="js-switch" name="sum['+course_number+'][ticket_booking]"/> </div> </div> <div class="row"> <label class="col-md-2 control-label">TRANSFER BOOKING?</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][transfer_booking_date]" readonly> <input type="checkbox" class="js-switch" name="sum['+course_number+'][transfer_booking]"/> </div> <label class="col-md-2 control-label">DEPARTURE BOOKING?</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][departure_booking_date]" readonly> <input type="checkbox" class="js-switch" name="sum['+course_number+'][departure_booking]"/> </div> </div> <div class="row"> <label class="col-md-2 control-label">Installment plan?</label> <div class="col-md-4"> <input type="checkbox" class="js-switch installment_switch" id="installment_plan" name="sum['+course_number+'][installment_plan]"/> </div> <div class="mb_hide_this_please"> <label class="col-md-2 control-label toggle_hide " for="installment">Installment No.</label> <div class="col-md-4"> <select class="form-control input-md toggle_hide installment_number" name="sum['+course_number+'][installment_number]" type="text" class="form-control" sum-num="'+course_number+'"> <option value="1">1 </option> <option value="2">2 </option> <option value="3">3 </option> <option value="4">4 </option> <option value="5">5 </option> <option value="6">6 </option> <option value="7">7 </option> <option value="8">8 </option> </select> </div> </div> </div> <div class="mb_hide_this_please"> <div class="installment_container" sum-num="'+course_number+'"> <div class="row installment_box toggle_hide super_active active"> <label class="col-md-2 control-label">Installment No.</label> <div class="col-md-4 control-label label_align_left"> 1. </div> <div class="installment_box_date row"> <label class="col-md-2 control-label">From date to date</label> <div class="input-group input-daterange col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][0][from]" readonly=""> <span class="input-group-addon">to</span> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][0][to]" readonly=""> </div> <label class="col-md-2 control-label">Amount</label> <div class="col-md-4"> <input type="number" class="form-control" name="sum['+course_number+'][installment][0][amount]"> </div> <label class="col-md-2 control-label" for="installment">Due Date</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][0][p_date]" readonly=""> <input type="checkbox" class="js-switch installment_paid_switch" name="sum['+course_number+'][installment][0][p_status]"> </div> </div> <!--end--> </div><!--end installment select--> <div class="row installment_box"> <label class="col-md-2 control-label">Installment No.</label> <div class="col-md-4 control-label label_align_left"> 2. </div> <div class="installment_box_date row"> <label class="col-md-2 control-label">From date to date</label> <div class="input-group input-daterange col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][1][from]" readonly=""> <span class="input-group-addon">to</span> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][1][to]" readonly=""> </div> <label class="col-md-2 control-label">Amount</label> <div class="col-md-4"> <input type="number" class="form-control" name="sum['+course_number+'][installment][1][amount]"> </div> <label class="col-md-2 control-label" for="installment">Due Date</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][1][p_date]" readonly=""> <input type="checkbox" class="js-switch installment_paid_switch" name="sum['+course_number+'][installment][1][p_status]"> </div> </div> <!--end--> </div><!--end installment select--> <div class="row installment_box"> <label class="col-md-2 control-label">Installment No.</label> <div class="col-md-4 control-label label_align_left"> 3. </div> <div class="installment_box_date row"> <label class="col-md-2 control-label">From date to date</label> <div class="input-group input-daterange col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][2][from]" readonly=""> <span class="input-group-addon">to</span> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][2][to]" readonly=""> </div> <label class="col-md-2 control-label">Amount</label> <div class="col-md-4"> <input type="number" class="form-control" name="sum['+course_number+'][installment][2][amount]"> </div> <label class="col-md-2 control-label" for="installment">Due Date</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][2][p_date]" readonly=""> <input type="checkbox" class="js-switch installment_paid_switch" name="sum['+course_number+'][installment][2][p_status]"> </div> </div> <!--end--> </div><!--end installment select--> <div class="row installment_box"> <label class="col-md-2 control-label">Installment No.</label> <div class="col-md-4 control-label label_align_left"> 4. </div> <div class="installment_box_date row"> <label class="col-md-2 control-label">From date to date</label> <div class="input-group input-daterange col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][3][from]" readonly=""> <span class="input-group-addon">to</span> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][3][to]" readonly=""> </div> <label class="col-md-2 control-label">Amount</label> <div class="col-md-4"> <input type="number" class="form-control" name="sum['+course_number+'][installment][3][amount]"> </div> <label class="col-md-2 control-label" for="installment">Due Date</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][3][p_date]" readonly=""> <input type="checkbox" class="js-switch installment_paid_switch" name="sum['+course_number+'][installment][3][p_status]"> </div> </div> <!--end--> </div><!--end installment select--> <div class="row installment_box"> <label class="col-md-2 control-label">Installment No.</label> <div class="col-md-4 control-label label_align_left"> 5. </div> <div class="installment_box_date row"> <label class="col-md-2 control-label">From date to date</label> <div class="input-group input-daterange col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][4][from]" readonly=""> <span class="input-group-addon">to</span> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][4][to]" readonly=""> </div> <label class="col-md-2 control-label">Amount</label> <div class="col-md-4"> <input type="number" class="form-control" name="sum['+course_number+'][installment][4][amount]"> </div> <label class="col-md-2 control-label" for="installment">Due Date</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][4][p_date]" readonly=""> <input type="checkbox" class="js-switch installment_paid_switch" name="sum['+course_number+'][installment][4][p_status]"> </div> </div> <!--end--> </div><!--end installment select--> <div class="row installment_box"> <label class="col-md-2 control-label">Installment No.</label> <div class="col-md-4 control-label label_align_left"> 6. </div> <div class="installment_box_date row"> <label class="col-md-2 control-label">From date to date</label> <div class="input-group input-daterange col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][5][from]" readonly=""> <span class="input-group-addon">to</span> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][5][to]" readonly=""> </div> <label class="col-md-2 control-label">Amount</label> <div class="col-md-4"> <input type="number" class="form-control" name="sum['+course_number+'][installment][5][amount]"> </div> <label class="col-md-2 control-label" for="installment">Due Date</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][5][p_date]" readonly=""> <input type="checkbox" class="js-switch installment_paid_switch" name="sum['+course_number+'][installment][5][p_status]"> </div> </div> <!--end--> </div><!--end installment select--> <div class="row installment_box"> <label class="col-md-2 control-label">Installment No.</label> <div class="col-md-4 control-label label_align_left"> 7. </div> <div class="installment_box_date row"> <label class="col-md-2 control-label">From date to date</label> <div class="input-group input-daterange col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][6][from]" readonly=""> <span class="input-group-addon">to</span> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][6][to]" readonly=""> </div> <label class="col-md-2 control-label">Amount</label> <div class="col-md-4"> <input type="number" class="form-control" name="sum['+course_number+'][installment][6][amount]"> </div> <label class="col-md-2 control-label" for="installment">Due Date</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][6][p_date]" readonly=""> <input type="checkbox" class="js-switch installment_paid_switch" name="sum['+course_number+'][installment][6][p_status]"> </div> </div> <!--end--> </div><!--end installment select--> <div class="row installment_box"> <label class="col-md-2 control-label">Installment No.</label> <div class="col-md-4 control-label label_align_left"> 8. </div> <div class="installment_box_date row"> <label class="col-md-2 control-label">From date to date</label> <div class="input-group input-daterange col-md-4"> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][7][from]" readonly=""> <span class="input-group-addon">to</span> <input type="text" class="form-control datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][7][to]" readonly=""> </div> <label class="col-md-2 control-label">Amount</label> <div class="col-md-4"> <input type="number" class="form-control" name="sum['+course_number+'][installment][7][amount]"> </div> <label class="col-md-2 control-label" for="installment">Due Date</label> <div class="col-md-4"> <input type="text" class="datepicker" placeholder="12/12/12" name="sum['+course_number+'][installment][7][p_date]" readonly=""> <input type="checkbox" class="js-switch installment_paid_switch" name="sum['+course_number+'][installment][7][p_status]"> </div> </div> <!--end--> </div><!--end installment select--> </div> </div> <div class="row delete_button"><center> <button type="button" class="btn btn-danger animated delete_sum" sum-num="'+course_number+'">Delete this Summary</button></center><hr></div> </div>');
      element = '.sum_pref[sum-num="'+course_number+'"] .bfh-countries';
      element_two = '.sum_pref[sum-num="'+course_number+'"]';
      jQuery(element).bfhcountries();
      element_three = '.sum_pref[sum-num="'+course_number+'"] .datepicker';
      jQuery(element_three).datepicker({
          format: 'dd/mm/yyyy'
      });
      element_four = '.sum_pref[sum-num="'+course_number+'"] .js-switch';
      var elems = Array.prototype.slice.call(document.querySelectorAll(element_four));
      elems.forEach(function(html) {
        var switchery = new Switchery(html, { size: 'small'});
      });
      jQuery(element_two).fadeIn();
      jQuery(this).attr('sum-num',course_number);
    }
  });
  jQuery('.edu_pref_parent').on('click','.delete_edu',function(){
    current_number = jQuery(this).attr('edu-num');
    current_total_count = jQuery('.number_of_elements.edu').html();
    if(typeof current_total_count !== "undefined") {
      current_total_count = current_total_count.replace("(", "");
      current_total_count = current_total_count.replace(")", "");
      current_total_count_num = parseInt(current_total_count) - 1;
      jQuery('.number_of_elements.edu').html("("+current_total_count_num+")");
    }
    element = '.edu_pref[edu-num="'+current_number+'"]';
    jQuery(element).fadeOut('slow', function() {
    jQuery(this).remove();
    });
  });
    jQuery('.sum_pref_parent').on('click','.delete_sum',function(){
    current_total_count = jQuery('.number_of_elements.sum').html();
    if(typeof current_total_count !== "undefined") {
      current_total_count = current_total_count.replace("(", "");
      current_total_count = current_total_count.replace(")", "");
      current_total_count_num = parseInt(current_total_count) - 1;
      jQuery('.number_of_elements.sum').html("("+current_total_count_num+")");
    }
    current_number = jQuery(this).attr('sum-num');
    element = '.sum_pref[sum-num="'+current_number+'"]';
    jQuery(element).fadeOut('slow', function() {
    jQuery(this).remove();
    });
  });
  jQuery('.datepicker').datepicker({
    format: 'dd/mm/yyyy'
});
  reg_type_display();
  dual_type_display(jQuery( "#dual_nation" ).checked);
  jQuery( "#reg-type" ).change(function() {
    reg_type_display();
});
var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));

elems.forEach(function(html) {
  var switchery = new Switchery(html, { size: 'small'});
});

  jQuery( "#dual_nation" ).change(function() {
    dual_type_display(this.checked);
  });
foreign_address(jQuery( "#post_same" ).checked);
  jQuery( "#post_same" ).change(function() {
    foreign_address(this.checked);
  });
jQuery(".datepicker").mouseover(function() { 
    current_date = jQuery(this).val();
    if (current_date) {
      current_date_sliced = current_date.slice(6);
      thai_year = Number(current_date_sliced) + 543;
      current_day_month = current_date.substr(0,5);
      temp_date = 'Thai: '+current_day_month+'/'+thai_year;
      jQuery(this).val(temp_date);
    }
})
.mouseout(function() { 
        jQuery(this).val(current_date); 
});
jQuery('.step_parent').on('click', function(){
    if(!jQuery(this).hasClass('active')) {
      jQuery('.step_parent.active').removeClass('active');
      jQuery('.step_child').slideUp();
      jQuery(this).next('.step_child').slideDown();
      jQuery(this).addClass('active');
    }
  });

//Palm Edits

  jQuery('.instution_array').on('change', function() {
    var inst = jQuery(this).val()
    if(inst=="OTHER")
    {
      jQuery('.toggle_other_instuition').fadeToggle();
    }
  });

  jQuery('.filter_option_dropdown').on('change', function() {
      jQuery("body").animate({ scrollTop: 0 }, 600);
      return false;
  });
   jQuery('#number_of_students').on('change', function(){
  var current_value = jQuery(this).val();
  mb_table.page.len(current_value).draw();
});
}); 

