#########################################################################
# Simple makefile for packaging Vizio VIA Plex widget
#
# Makefile Usage:
# > make
# > make clean
#
# Important Notes: 
# The output of the build process is a zip file with a .widget extension.
# This widget bundle can then be uploaded to
# http://gallery.tv.widgets.yahoo.com/publisher/ for testing on a device.
#
# For more details, see:
# http://developer.yahoo.com/connectedtv/installguide/CTV_IG_Testing_on_a_Consumer_Device.html
##########################################################################  
FILES := $(shell find Plex.widget -type f -not -path '*/.*')
CFG = Plex.widget/Contents/widget.xml

APPNAME := $(shell xpath -q -e 'metadata/name/text()' $(CFG))
APPVERSION := $(shell xpath -q -e 'metadata/version/text()' $(CFG))
APPID := $(shell xpath -q -e 'metadata/identifier/text()' $(CFG))

WIDGET := $(APPID)-$(APPVERSION).widget


$(WIDGET): $(FILES)
	@echo "  >> creating application $(WIDGET)"
	zip $(WIDGET) $(FILES)

all: $(WIDGET)

clean:
	rm $(shell find . -maxdepth 1 -type f -name '*.widget')
