class OptionTag{
  constructor(yyyy, mm, dd){
    this.yyyy = yyyy;
    this.mm = mm;
    this.dd = dd;

    this.optionTag = document.createElement("option");
    $(this.optionTag).val(yyyy+ '-' + mm + '-' + dd);
    $(this.optionTag).html(yyyy + '-' + mm + '-' +dd);
    $('#dateSel').append($(this.optionTag));
  }
}
