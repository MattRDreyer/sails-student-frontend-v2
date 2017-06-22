(function() {


  //function to delete record by settin id on form and then submitting the form
  //sets value of major class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id) {
    $("#deleteform input[name=major_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getMajorClass(record_id) {
    return $.get("http://localhost:1337/major_class/" + record_id, function(data) {
      console.log("got major class");
    })
  }

  $(function() {

    $('#MajorClassTable').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      colReorder: true,
      "scrollX": true,
      columnDefs: [
        {width: '20%', targets: 2}
      ]
    });

    var validator =  $("#manageMajorClassForm").validate({
        errorClass: "text-danger",
        rules: {
          major_class_id: {
            required: true
          },
          major_id: {
            required: true,
        },
        messages: {
          major_class_id: {
            required: "Enter the Major Class ID!!!",
          },
          major_id: {
            required: "Enter the Major ID!!!",
          }
        }
      }
      });




    //initialize variables for items in the DOM we will work with
    let manageMajorClassForm = $("#manageMajorClassForm");
    let addMajorClassButton = $("#addMajorClassButton");

    //add MajorClass button functionality
    addMajorClassButton.click(function() {
      $("input").val('');
      validator.resetForm();
      manageMajorClassForm.attr("action", "/create_major_class");
      manageMajorClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Submit": function() {
            //function to delete record
            manageMajorClassForm.submit()
          }
        }
      });
    })

    $("#MajorClassTable").on("click", "#editButton", function(e) {
      let recordId = $(this).data("majorclassid")
      manageMajorClassForm.find("input[name=major_class_id]").val(recordId);
      manageMajorClassForm.attr("action", "/update_major_class");
      let majorClass = getMajorClass(recordId);

      //populate form when api call is done (after we get MajorClass to edit)
      majorClass.done(function(data) {
        $.each(data, function(name, val) {
          var $el = $('[name="' + name + '"]'),
            type = $el.attr('type');

          switch (type) {
            case 'checkbox':
              $el.attr('checked', 'checked');
              break;
            case 'radio':
              $el.filter('[value="' + val + '"]').attr('checked', 'checked');
              break;
            default:
              $el.val(val);
          }
        });
      })

      manageMajorClassForm.dialog({
        title: "Edit Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          Submit: function() {
            //function to delete record
            manageMajorClassForm.submit()
          }
        }
      });
    })


    $("#MajorClassTable").on("click", "#deleteButton", function(e) {
      let recordId = $(this).data("majorclassid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $(this).dialog("close");
          },
          "Delete Major Class": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();

// we will be adding stuff to this js file like we did yesterday to make our buttons
// into drop downs and stuff
