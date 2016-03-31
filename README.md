## What is it?
A tool that allows users to see if a hiring partner is mentioned in an email thread. To be used as a gmail extension

## What does it do?
 - Parses contents of a csv collecting the names of hiring partners
 - Digests the text of an email thread
 - Looks for intersections in both the partner list and email text list
 - Presents any mentions of a hiring partner in sidebar box

## Who should use it?
 - Any team local or global that would like the convenience of quickly seeing whether or not a hiring partner is mentioned in an email

## How do you set it up?
Currently it is deployed as a chrome extension and can be downloaded in the chrome webstore.

### For Developers
1. Fork and clone the repo
2. Open Chrome, navigate to [](chrome://extensions/)
3. Ensure developer mode is checked
4. Click `Load Unpacked Extension...`
5. Select this repo's directory on your local machine

**note:** After you make changes, reload the extension on this page

## Requirements
 - Currently supported in Chrome only. Safari support to come.
 - The core functionality of this tool relies on digesting a CSV file of names to sort through. Therefore in the current version
it is recomended that a CSV is provided.
 -

## Current Edge Cases
 - 'Velope', 'Cisco'

