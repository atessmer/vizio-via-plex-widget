#########################################################################
# Simple makefile for packaging Vizio VIA Plex widget
#
# Makefile Usage:
# > make
#
# Important Notes: 
# The output of the build process is a zip file with a .widget extension.
# This widget bundle can then be uploaded to
# http://gallery.tv.widgets.yahoo.com/publisher/ for testing on a device.
#
# For more details, see:
# http://developer.yahoo.com/connectedtv/installguide/CTV_IG_Testing_on_a_Consumer_Device.html
##########################################################################  
WIDGET_CFG = 'Plex.widget/Contents/widget.xml'
APPNAME = $(shell xpath -q -e 'metadata/name/text()' $(WIDGET_CFG))
APPVERSION = $(shell xpath -q -e 'metadata/version/text()' $(WIDGET_CFG))
APPID = $(shell xpath -q -e 'metadata/identifier/text()' $(WIDGET_CFG))
ZIP_EXCLUDE = -x */.*

package:
	@echo "  >> creating application $(APPID)-$(APPVERSION).widget"
	zip $(ZIP_EXCLUDE) -r $(APPID)-$(APPVERSION).widget Plex.widget

all: package
