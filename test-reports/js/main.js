$(function() {

  // draw pie chart
  drawPieChart();

  var preview = $('#mismatch-preview');
  if (preview.find('.carousel-inner .item').length === 1) {
    preview.find('.carousel-control').remove();
    preview.find('.carousel-inner img:first-child').css('margin-top', '0px');
  }

  // double click to trigger image preview dialog
  $('#mismatch-list').on('click', '.tr-mismatch', function() {
    var td = $(this).find('td');
    var name = $(td[2]).html();
    var preview = $('#mismatch-preview');
    preview.find('.modal-title').html(name);
    preview.find('div[name="' + name + '"]').addClass('active');
    preview.modal({
      keyboard: false
    });
  });

  // image preview dialog
  $('#mismatch-preview').on('show.bs.modal', function() {
    var carousel = $(this).find('.carousel');
    carousel.carousel({
      wrap: false
    });
    carousel.carousel('pause');
  });

  $('#mismatch-preview').on('hidden.bs.modal', function() {
    $(this).find('.carousel-inner div').attr('class', 'item');
  });

  $('#mismatch-preview').on('click', '.left', function(e) {
    e.preventDefault();
    var preview = $('#mismatch-preview');
    var active = preview.find('.carousel-inner .active');
    var prev = active.prev()[0];
    if (prev === undefined) return;

    preview.find('.modal-title').html($(prev).attr('name'));
    active.removeClass('active');
    $(prev).addClass('active');
  });

  $('#mismatch-preview').on('click', '.right', function(e) {
    e.preventDefault();
    var preview = $('#mismatch-preview');
    var active = preview.find('.carousel-inner .active');
    var next = active.next()[0];
    if (next === undefined) return;

    preview.find('.modal-title').html($(next).attr('name'));
    active.removeClass('active');
    $(next).addClass('active');
  });

});

function drawPieChart() {
  nv.addGraph(function() {
    var chart = nv.models.pieChart()
      .x(function(d) {
        return d.key
      })
      .y(function(d) {
        return d.value
      })
      .showLabels(false)
      .valueFormat(d3.format('.2%'));

    d3.select("#testpiechart")
      .datum(testData())
      .transition().duration(350)
      .call(chart);

    return chart;
  });
}

function testData() {
  var tbody = $('#testdata tbody');
  var total = tbody.find('.data-total').html();
  var pass = (tbody.find('.data-pass').html()) / total;
  var fail = (tbody.find('.data-fail').html()) / total;
  var nobaseline = (tbody.find('.data-nobaseline').html()) / total;

  return [{
    "key": "Pass",
    "value": pass,
    "color": "#3B9211"
  }, {
    "key": "Fail",
    "value": fail,
    "color": "#DA181E"
  }, {
    "key": "No Baseline",
    "value": nobaseline,
    "color": "#EA810C"
  }];
}
