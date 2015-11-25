$(function() {

  var WatchList = function(stocksList, searchInput) {
    this.topStocks = [];
    this.stocksList = stocksList;
    this.searchInput = searchInput;
  }

  WatchList.prototype.refreshList = function() {
    var self = this;
    $(self.stocksList + ' li').remove();
    $.each(self.topStocks, function(i, stock) {
      $(self.stocksList).append('<li><span class="stock">' + 
                                '<span class="symbol"><a class="link" href="#">' + stock.symbol + '</a></span>' + ' ' +
                                '<span class="price">' + stock.price + '</span>' + 
                                '<div style="clear:both"></div></span></li>')
    });
  };

  WatchList.prototype.init = function() {
    var self = this;
    $(self.searchInput).autocomplete({
      source: function(request, response) {
        $.ajax({
          url: 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?',
          dataType: "jsonp",
          data: {
            input: request.term
          },
          success: function(data) {
            var possibleSymbols = [];
            $.each(data, function(i, val) {
              possibleSymbols.push(val.Symbol);
            });
            response(possibleSymbols);
          }
        });
      },
      select: function( event, ui ) {
        var symbol = ui.item.value;
        $.ajax({
          url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?',
          dataType: "jsonp",
          data: {
            symbol: symbol
          },
          success: function(data) {
            var price = data.LastPrice;
            self.topStocks.push({symbol: symbol, price: price});
            self.refreshList();
          }
        });
      }
    });
  }

  watchlist = new WatchList('#top-stocks', '#symbol');
  watchlist.init();

});
