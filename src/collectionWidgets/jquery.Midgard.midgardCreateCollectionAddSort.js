/*
//     Create.js - On-site web editing interface
//     (c) 2011-2012 Henri Bergius, IKS Consortium
//     Create may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://createjs.org/
*/
(function (jQuery, undefined) {
  // Run JavaScript in strict mode
  /*global jQuery:false _:false window:false console:false */
  'use strict';

  // # Widget for adding items to a collection
  jQuery.widget('Midgard.midgardCollectionAddSort', jQuery.Midgard.midgardCollectionAdd, {

    _create: function() {
      this._super();
      this.widgetEventPrefix = 'midgardeditable';
      this.options.templates.button = '<button class="create-ui-btn"><i class="icon-<%= icon %>"></i> <%= label %></button>';
    },

    prepareMoveButton: function () {
      var widget = this;
      var moveButton = jQuery(_.template(this.options.templates.button, {
        icon: 'move',
        label: ''
      })).button();
      moveButton.addClass('midgard-create-move');
      moveButton.click(function (event) {
        event.preventDefault();
        if (!jQuery(this).data('move')) {
          jQuery(this).data('move', true);
          jQuery(this).addClass('active');
          jQuery(widget.options.view.el).sortable({
            opacity: 0.8,
            containment: 'parent',
            update: function(event, ui) {
              var subject = widget.options.view.service.getElementSubject(ui.item);
              var model = widget.options.collection.get(subject);
              var oldIndex = widget.options.collection.indexOf(model);
              var newIndex = jQuery(ui.item.parent().children('[about]')).index(ui.item);
              if (oldIndex != newIndex) {
                widget.options.collection.remove(model, {silent: true}); // silence this to stop excess event triggers
                widget.options.collection.add(model, {at: newIndex, silent: true});
                widget._trigger('changed', null, { instance: widget.options.model });
              }
            }
          });
        } else {
          jQuery(this).data('move', false);
          jQuery(this).removeClass('active');
          jQuery(widget.options.view.el).sortable('destroy');
        }
      });
      return moveButton;
    },

    enable: function () {
      var widget = this;

      var moveButton = widget.prepareMoveButton();
      jQuery(widget.options.view.el).after(moveButton);
      widget.addButtons.push(moveButton);

      var addButton = jQuery(_.template(this.options.templates.button, {
        icon: 'plus',
        label: this.options.editableOptions.localize('Add', this.options.editableOptions.language)
      })).button();
      addButton.addClass('midgard-create-add');
      addButton.click(function () {
        widget.addItem(addButton);
      });
      jQuery(widget.options.view.el).after(addButton);

      widget.addButtons.push(addButton);

      this.checkCollectionConstraints();
    },

    disable: function () {
      var widget = this;
      jQuery.each(widget.addButtons, function (idx, button) {
        button.remove();
      });
      widget.addButtons = [];
    }
  })
})(jQuery);
