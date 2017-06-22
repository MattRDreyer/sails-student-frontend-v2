(function() {


  //function to delete record by settin id on form and then submitting the form
  //sets value of instructor id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id) {
    $("#deleteform input[name=instructor_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getInstructor(record_id) {
    return $.get("http://localhost:1337/instructor/" + record_id, function(data) {
      console.log("got instructor");
    })
  }

  $(function() {

    $('#instructorTable').DataTable({
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      colReorder: true,
      "scrollX": true,
      columnDefs: [
        {width: '20%', targets: 6}
      ]
    });

    var validator =  $("#manageInstructorForm").validate({
        errorClass: "text-danger",
        rules: {
          first_name: {
            required: true,
            minlength: 2
          },
          last_name: {
            required: true,
            minlength: 2
        },
        messages: {
          first_name: {
            required: "Enter the first name!!!",
            minlength: jQuery.validator.format("At least 2 characters required for first name!")
          },
          last_name: {
            required: "Enter the last name!!!",
            minlength: jQuery.validator.format("At least 2 characters required for first name!")
          }
        }
      }
      });




      //initialize variables for items in the DOM we will work with
      let manageInstructorForm = $("#manageInstructorForm");
      let addInstructorButton = $("#addInstructorButton");

      //add instructor button functionality
      addInstructorButton.click(function() {
        $("input").val('');
        validator.resetForm();
        manageInstructorForm.attr("action", "/create_instructor");
        manageInstructorForm.dialog({
          title: "Add Record",
          width: 700,
          modal: true,
          buttons: {
            Cancel: function() {
              $(this).dialog("close");
            },
            "Submit": function() {
              //function to delete record
              manageInstructorForm.submit()
            }
          }
        });
      })

      $("#instructorTable").on("click", "#editButton", function(e) {
        let recordId = $(this).data("instructorid")
        manageInstructorForm.find("input[name=instructor_id]").val(recordId);
        manageInstructorForm.attr("action", "/update_instructor");
        let instructor = getInstructor(recordId);

        //populate form when api call is done (after we get instructor to edit)
        instructor.done(function(data) {
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

        manageInstructorForm.dialog({
          title: "Edit Record",
          width: 700,
          modal: true,
          buttons: {
            Cancel: function() {
              $(this).dialog("close");
            },
            Submit: function() {
              //function to delete record
              manageInstructorForm.submit()
            }
          }
        });
      })


      $("#instructorTable").on("click", "#deleteButton", function(e) {
        let recordId = $(this).data("instructorid")
        $("#deleteConfirm").dialog({
          title: "Confirm Delete",
          modal: true,
          buttons: {
            Cancel: function() {
              $(this).dialog("close");
            },
            "Delete Instructor": function() {
              //function to delete record
              deleteRecord(recordId);
            }
          }
        });
      })

    })

})();
//
// // we will be adding stuff to this js file like we did yesterday to make our buttons
// // into drop downs and stuff
