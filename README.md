# SteezTest.me Css Unit Test Core Package

[![Build Status](https://travis-ci.org/numtel/css-unit-test-core.svg?branch=master)](https://travis-ci.org/numtel/css-unit-test-core)

## Installation

    meteor add numtel:css-unit-test-core

## Implements

### Collections

* `CssTests` - Test records
* `CssHistory` - Reports from each test run
* `CssNormatives` (server only)

### Subscribe Handles (client only)

* `CssTestsHandle`
* `CssHistoryHandle`

### CssTest Class

* `new CssTest(id)` - Load CssTest by Id
* `new CssTest({...})` - Create new CssTest
* `CssTest.remove()` - Completely delete `CssTest` and corresponding `CssHistory` and `CssNormatives` documents
* `CssTest.update({...})` - Update fields on current CssTest
* `CssTest.getHtml([{...}])` - Return full html including fixture and stylesheets.

    Optionally pass in options:

    `fixtureHtml: [string specified fixture html],`

    `normativeValue: [object containing styles from a normative],`

    `diff: [object containing style differences from normativeValue]`

* `CssTest.getThumbnail([{...}])` - Return thumbnail preview in PNG data URI format (from cache if possible).

    Optionally pass in options:

    `width: [integer width in pixels],`

    `height: [integer height in pixels],`

    `forceRefresh: [boolean to bypass cache]`

* `CssTest.extractStyles()` - Load page element styles for each width. Returns the styles object.
* `CssTest.setNormative()` - Set new test normative using current styles. Returns the normative object.
* `CssTest.loadNormative([id])` - Load a normative associated with this test. By default, the latest will be loaded, otherwise pass in the normative's Id as the only argument. Returns the normative document if found or undefined if not.
* `CssTest.run()` - Run the test against the latest normative, returns the report.
