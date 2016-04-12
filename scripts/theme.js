/**
 * @name      ElkArte Forum
 * @copyright ElkArte Forum contributors
 * @license   BSD http://opensource.org/licenses/BSD-3-Clause
 *
 * This software is a derived product, based on:
 *
 * Simple Machines Forum (SMF)
 * copyright:	2011 Simple Machines (http://www.simplemachines.org)
 * license:		BSD, See included LICENSE.TXT for terms and conditions.
 *
 * @version 1.0.6
 *
 * This file contains javascript associated with the current theme
 */

$(document).ready(function() {
	// Menu drop downs
	if (use_click_menu)
		$('#main_menu, ul.admin_menu, ul.sidebar_menu, ul.poster, ul.quickbuttons, #sort_by').superclick({speed: 150, animation: {opacity:'show', height:'toggle'}, speedOut: 0, activeClass: 'sfhover'});
	else
		$('#main_menu, ul.admin_menu, ul.sidebar_menu, ul.poster, ul.quickbuttons, #sort_by').superfish({delay : 300, speed: 175, hoverClass: 'sfhover'});

	// Expand Panel
	$("#open").click(function(){
		$("#panel").slideDown("slow");
	});

	// Collapse Panel
	$("#close").click(function(){
		$("#panel").slideUp("slow");
	});

	// Switch buttons from "Log In | Register" to "Close Panel" on click
	$("#toggle a").click(function () {
		$("#toggle a").toggle();
	});

	// Enable the quick search expansion if enabled.
	if ($('#controls').length !== 0)
		$('#search_form').elk_QuickSearch();

	// Tooltips
	if ((!is_mobile && !is_touch) || use_click_menu)
		$('.preview').SiteTooltip({hoverIntent: {sensitivity: 10, interval: 750, timeout: 50}});

	// Find all nested linked images and turn off the border
	$('a.bbc_link img.bbc_img').parent().css('border', '0');

	// Fix code blocks so they are as compact as possible
	if (typeof elk_codefix === 'function')
		elk_codefix();

	// Enable the ... page expansion
	$('.expand_pages').expand_pages();

	// Collapsabile fieldsets, pure candy
	$(document).on('click', 'legend', function(){
		$(this).siblings().slideToggle("fast");
		$(this).parent().toggleClass("collapsed");
	});
	$(document).on('ready', 'legend', function () {
		if ($(this).data('collapsed'))
			$(this).click();
	});

	// Spoiler
	$('.spoilerheader').click(function() {
		$(this).next().children().slideToggle("fast");
	});

	// BBC [img] element toggle for height and width styles of an image.
	$('img').each(function() {
		// Not a resized image? Skip it.
		if ($(this).hasClass('bbc_img resized') === false)
			return true;

		$(this).css({'cursor': 'pointer'});

		// Note to addon authors, if you want to enable your own click events to bbc images
		// you can turn off this namespaced click event with $("img").off("click.elk_bbc")
		$(this).on( "click.elk_bbc", function() {
			var $this = $(this);

			// No saved data, then lets set it to auto
			if ($.isEmptyObject($this.data()))
			{
				$this.data("bbc_img", {
						width: $this.css('width'),
						height: $this.css('height'),
						'max-width': $this.css('max-width'),
						'max-height': $this.css('max-height'),
				});
				$this.css({'width': $this.css('width') === 'auto' ? null : 'auto'});
				$this.css({'height': $this.css('height') === 'auto' ? null : 'auto'});

				// Overide default css to allow the image to expand fully, add a div to exand in
				$this.css({'max-width': 'none'});
				$this.css({'max-height': 'none'});
				$this.wrap('<div style="overflow: auto"></div>');
			}
			else
			{
				// Was clicked and saved, so set it back
				$this.css({'width': $this.data("bbc_img").width});
				$this.css({'height': $this.data("bbc_img").height});
				$this.css({'max-width': $this.data("bbc_img")['max-width']});
				$this.css({'max-height': $this.data("bbc_img")['max-height']});

				// Remove the data
				$this.removeData();

				// Remove the div we added to allow the image to overflow expand in
				$this.unwrap();
				$this.css({'max-width': '100%'});
			}
		});
	});
	$('.hamburger_30').click(function(e) {
		e.preventDefault();
		var id = $(this).data('id');
		$('#' + id).addClass('visible');
		$(this).addClass('visible');
	});
});

/**
 * Keep the login/register button positioned on the wrapper
 */
$(window).resize(function() {
var head_pos = $('#wrapper').offset().left,
	x = head_pos + 50;

	$("#toggle").css({right:x});
});

/**
 * Expand the quick search area when the search box is clicked.
 */
;(function($) {
    $.fn.elk_QuickSearch = function() {
		var iCount = 0,
			$this = $(this);

		this.find('#quicksearch').focus(function(focusEvent) {
			iCount++;

			if (iCount === 1 && !('getElementsByClassName' in document)) {
				// IE 8 issues
				$this.find('input').keydown(function(e) {
					if (e.keyCode === 13) {
						$(this).parents('form').submit();
						return false;
					}
				});
			}

			// Set the parent as active, show the search form
			$this.addClass('active');
			$this.find('#controls').slideDown(0);

			// Set a click out method to close the control
			$(document).bind('click', function(clickEvent)
			{
				if (!$(clickEvent.target).parents('#search_form').length)
				{
					$this.unbind(clickEvent);
					$this.find('#controls').slideUp(100, function() {
						$this.removeClass('active');
					});
				}
			});

			return this;
		});
	};
})(jQuery);

/**
 * Adds a button to the quick topic moderation after a checkbox is selected
 *
 * @param {string} sButtonStripId
 * @param {boolean} bUseImage
 * @param {object} oOptions
 */
function elk_addButton(sButtonStripId, bUseImage, oOptions)
{
	var oButtonStrip = document.getElementById(sButtonStripId),
		aItems = oButtonStrip.getElementsByTagName('span');

	// Remove the 'last' class from the last item.
	if (aItems.length > 0)
	{
		var oLastSpan = aItems[aItems.length - 1];
		oLastSpan.className = oLastSpan.className.replace(/\s*last/, 'position_holder');
	}

	// Add the button.
	var oButtonStripList = oButtonStrip.getElementsByTagName('ul')[0],
		oNewButton = document.createElement('li'),
		oRole = document.createAttribute('role');

	oRole.value = 'menuitem';
	oNewButton.setAttributeNode(oRole);

	if ('sId' in oOptions)
		oNewButton.id = oOptions.sId;
	oNewButton.innerHTML = '<a class="linklevel1" href="' + oOptions.sUrl + '" ' + ('sCustom' in oOptions ? oOptions.sCustom : '') + '><span class="last"' + ('sId' in oOptions ? ' id="' + oOptions.sId + '_text"': '') + '>' + oOptions.sText + '</span></a>';

	oButtonStripList.appendChild(oNewButton);
}