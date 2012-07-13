/*
---
script: FilterTable.js

name: FilterTable

description: MooTools Plugin for filtering table rows.

authors:
  - Thibault Debatty
  - Carl Holmberg

license:
  - MIT-style license

provides: [FilterTable]

...
*/

var FilterTable = new Class({

    /* Implements options */
    Implements: Options,

    /* Set options */
    options: {
        tableClass: 'filter-table',
        filterClass: 'filter-tr',
        filterStrict: 'filter-strict',
        filterExclude: 'filter-exclude'
    },
    
    rows: [],
    filters: [],

    /* 
     * Constructor of class.
     * @public    
     */
    initialize: function(options){
        this.setOptions(options);
        //get the tables from document
        document.getElements('table.' + this.options.tableClass).each(function(table, tblidx){
            this.rows[tblidx] = table.getElements('tbody tr');
            this.filters[tblidx] = table.getElements('thead tr.' + this.options.filterClass + ' td');
            this.filters[tblidx].each(function(filter, idx) {
                if (filter.getChildren().length < 1) {
                    this.filters[tblidx][idx] = false;
                }
            }, this);
                    
            table.getElements('thead input').each(function(input){
                input.addEvent('keyup', function(){
                    this.filterTable(table, tblidx);
                }.bind(this));
            }, this);

            table.getElements('thead select').each(function(input){
                input.addEvents({
                    change: function(){
                        this.filterTable(table, tblidx);
                    }.bind(this),

                    keyup: function(){
                        this.filterTable(table, tblidx);
                    }.bind(this)});
            }, this);
        }, this);
    },

    /* 
     * @param table (Element)
     * @public
     */
    filterTable: function(table, tblidx) {
    
        this.rows[tblidx].each(function(row) {
        //for each row of table execute
            row.removeClass(this.options.filterExclude);
            
            row.getElements('td').each(function(col, idx) {
                if (!row.hasClass(this.options.filterExclude)) {
                    if (this.filters[tblidx][idx]) {
                        var terms = this.filters[tblidx][idx].getChildren()[0].value.toLowerCase().split(" ");
                        //for each term do
                        for (i=0, j=terms.length; i < j; i++) {
                            //strips all tags from row, then test if the
                            //row contains or not the appropriate filter term.
                            if (this.filters[tblidx][idx].hasClass(this.options.filterStrict) && terms[i] !== '') {
                                if (col.innerHTML.replace(/<[^>]+>/g, "").toLowerCase() !== terms[i]) {
                                    row.addClass(this.options.filterExclude);
                                    break;
                                }
                            } else {
                                if (col.innerHTML.replace(/<[^>]+>/g, "").toLowerCase().indexOf(terms[i]) < 0) {
                                    row.addClass(this.options.filterExclude);
                                    break;
                                }
                            }
                        }
                    }
                }
            }, this);
        }, this);
    }
});