# Plex/Vizio VIA

Plex client for Vizio VIA Smart TVs

## Install

The Plex client is currently not available for download via the Yahoo! Connected
TV Store, as it is still in the early alpha stage. In order to install the
client on a device, you will have to build and install it as a test app from
source.

### Build

The build process is really just a matter of zipping the source with a .widget
extension. A Makefile is provided to name the output correctly.

`make`

### Install

An overview of the process for uploading/installing the test app:

1. Get your device's developer code from
    *TV Store* -> *Settings* -> *Developer Settings*

2. Upload the widged zip file to http://gallery.tv.widgets.yahoo.com/publisher/
    (This required a Yahoo! ID)

3. Open the TV Store on your device, and navigate to *Categories* -> *Test Apps*

For complete details, see the official Yahoo! Connected TV documentation at
http://developer.yahoo.com/connectedtv/installguide/CTV_IG_Testing_on_a_Consumer_Device.html
