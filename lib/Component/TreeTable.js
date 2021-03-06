'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TreeRow = require('./TreeRow');

var _TreeRow2 = _interopRequireDefault(_TreeRow);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TreeHeader = require('./TreeHeader');

var _TreeHeader2 = _interopRequireDefault(_TreeHeader);

var _NestedTreeHeader = require('./NestedTreeHeader');

var _NestedTreeHeader2 = _interopRequireDefault(_NestedTreeHeader);

var _Pagination = require('./Pagination/Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _DropdownList = require('./Pagination/DropdownList');

var _DropdownList2 = _interopRequireDefault(_DropdownList);

var _Util = require('./Util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Eleanor Mao on 2016/5/26.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Tree Table
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @version 4.0
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Author: Eleanor Mao
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * require bootstrap.css
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


require('../style/treetable.css');

function sliceData(data, page, length) {
    return data.slice((page - 1) * length, page * length);
}

function getAllValue(data, isKey) {
    if (data && data.length) {
        return data.map(function (row) {
            return row[isKey];
        });
    }
    return [];
}

function getAllKey(data, hashKey, keyName, childrenPropertyName) {
    var output = [];
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (hashKey && !item[keyName]) item[keyName] = (0, _Util.uniqueID)(); //引用大法好
        if (item[childrenPropertyName] && item[childrenPropertyName].length) {
            output.push(item[keyName]);
            data = data.concat(item[childrenPropertyName]);
        }
    }
    return output;
}

function initDictionary(props) {
    var dictionary = [],
        data = props.data.slice();
    if (props.isTree) {
        var uid = props.uid;
        var iskey = props.iskey;
        var isKey = props.isKey;
        var hashKey = props.hashKey;
        var expandAll = props.expandAll;
        var expandRowKeys = props.expandRowKeys;
        var childrenPropertyName = props.childrenPropertyName;

        var keyName = hashKey ? uid : iskey || isKey;
        if (expandAll) {
            dictionary = getAllKey(data, hashKey, keyName, childrenPropertyName);
        } else if (expandRowKeys && expandRowKeys.length) {
            dictionary = expandRowKeys.slice();
        }
    }
    return { data: data, dictionary: dictionary };
}

function getLastChild(data, selectRow) {
    var invalid = [],
        list = [],
        cellIndex = 0;
    for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].hidden) {
            invalid.push(i);
        }
        list.push(i);
    }
    var diffList = (0, _Util.diff)(list, invalid);
    cellIndex = diffList[diffList.length - 1];
    if (selectRow && selectRow.mode && selectRow.mode !== 'none' && !selectRow.hideSelectColumn) {
        cellIndex++;
    }
    return cellIndex;
}

function getDefLength(props) {
    var length = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

    if (props.pagination) {
        if (props.options) {
            var _props$options = props.options;
            var sizePerPage = _props$options.sizePerPage;
            var sizePageList = _props$options.sizePageList;

            if ('sizePerPage' in props.options) {
                return sizePerPage;
            } else {
                if (props.remote) {
                    return sizePageList && sizePageList.length ? sizePageList[0] : length;
                } else {
                    return length;
                }
            }
        }
    }
    return length;
}

var TreeTable = function (_Component) {
    _inherits(TreeTable, _Component);

    function TreeTable(props) {
        _classCallCheck(this, TreeTable);

        var _this = _possibleConstructorReturn(this, (TreeTable.__proto__ || Object.getPrototypeOf(TreeTable)).call(this, props));

        _this.isIE = !-[1];
        _this._instance = {};

        var _initDictionary = initDictionary(props);

        var data = _initDictionary.data;
        var dictionary = _initDictionary.dictionary;

        _this.state = {
            dictionary: dictionary,
            isHover: null,
            columnData: [],
            order: undefined,
            leftColumnData: [],
            renderedList: data,
            rightColumnData: [],
            sortField: undefined,
            crtPage: props.pagination && props.options.page || 1,
            allChecked: _this._isAllChecked(data, props.selectRow),
            length: getDefLength(props)
        };
        return _this;
    }

    _createClass(TreeTable, [{
        key: '_isAllChecked',
        value: function _isAllChecked(list, selectRow) {
            if (list && list.length && selectRow && selectRow.mode && selectRow.mode !== 'node' && selectRow.selected && selectRow.selected.length) {
                return !getAllValue(list.slice(), this._getKeyName()).filter(function (v) {
                    return !~selectRow.selected.indexOf(v);
                }).length;
            }
            return false;
        }
    }, {
        key: '_initColumnData',
        value: function _initColumnData(props) {
            var columnData = [];
            _react2['default'].Children.map(props.children, function (column) {
                columnData.push({
                    width: column.props.width,
                    id: column.props.dataField,
                    name: column.props.children,
                    hidden: column.props.hidden,
                    render: column.props.render,
                    colSpan: column.props.colSpan,
                    showArrow: column.props.showArrow,
                    dataAlign: column.props.dataAlign,
                    dataFixed: column.props.dataFixed,
                    dataFormat: column.props.dataFormat
                });
            });
            var sortedData = (0, _Util.sort)(columnData);
            this.setState(function (old) {
                old.columnData = sortedData.sorted;
                old.leftColumnData = sortedData.left;
                old.rightColumnData = sortedData.right;
                return old;
            });
        }
    }, {
        key: '_getKeyName',
        value: function _getKeyName() {
            var _props = this.props;
            var hashKey = _props.hashKey;
            var iskey = _props.iskey;
            var isKey = _props.isKey;
            var uid = _props.uid;

            return hashKey ? uid : iskey || isKey;
        }
    }, {
        key: '_adjustWidth',
        value: function _adjustWidth() {
            var refs = this._instance;
            if (!refs.colgroup || !refs.container) return;
            var firstRow = refs.colgroup.childNodes;
            var cells = refs.thead._thead.childNodes;
            var fixedLeftRow = refs.left && refs.left.childNodes;
            var fixedRightRow = refs.right && refs.right.childNodes;
            var nestedRow = refs.nested && refs.nested._colgroup.childNodes;
            var fixedLeftHeadRow = refs.lthead && refs.lthead._colgroup.childNodes;
            var fixedRightHeadRow = refs.rthead && refs.rthead._colgroup.childNodes;
            var isNoData = !refs.tbody || refs.tbody.firstChild.childElementCount === 1;
            var length = cells.length;
            var rightFixedLength = fixedRightRow ? length - fixedRightRow.length : 0;
            if (firstRow.length !== length) return;

            var scrollBarWidth = (0, _Util.getScrollBarWidth)(),
                haveScrollBar = refs.container.offsetHeight < refs.container.scrollHeight;

            var lastChild = getLastChild(this.state.columnData, this.props.selectRow),
                fixedRightWidth = 0;
            lastChild = this.props.selectRow.mode && this.props.selectRow.mode !== 'none' ? lastChild + 1 : lastChild;

            for (var i = 0; i < length; i++) {
                var cell = cells[i];
                var rightIndex = i - rightFixedLength;
                var computedStyle = getComputedStyle(cell);
                var width = parseFloat(computedStyle.width.replace('px', ''));
                if (this.isIE) {
                    var paddingLeftWidth = parseFloat(computedStyle.paddingLeft.replace('px', ''));
                    var paddingRightWidth = parseFloat(computedStyle.paddingRight.replace('px', ''));
                    var borderRightWidth = parseFloat(computedStyle.borderRightWidth.replace('px', ''));
                    var borderLeftWidth = parseFloat(computedStyle.borderLeftWidth.replace('px', ''));
                    width = width + paddingLeftWidth + paddingRightWidth + borderRightWidth + borderLeftWidth;
                }

                var lastPaddingWidth = -(lastChild === i && haveScrollBar ? scrollBarWidth : 0);

                if (!width) {
                    width = 120;
                    cell.width = width + lastPaddingWidth + 'px';
                }

                var result = (width + lastPaddingWidth).toFixed(2) + 'px';

                if (!isNoData) {
                    firstRow[i].style.width = result;
                    firstRow[i].style.maxWidth = result;
                }

                if (nestedRow && nestedRow[i]) {
                    var display = computedStyle.display;
                    nestedRow[i].style.width = width.toFixed(2) + 'px';
                    nestedRow[i].style.maxWidth = width.toFixed(2) + 'px';
                    if (display === 'none') nestedRow[i].style.display = display;
                }

                if (fixedLeftRow && fixedLeftRow[i]) {
                    fixedLeftRow[i].style.width = result;
                    fixedLeftRow[i].style.maxWidth = result;
                    fixedLeftHeadRow[i].style.width = result;
                    fixedLeftHeadRow[i].style.maxWidth = result;
                }

                if (fixedRightRow && fixedRightRow[rightIndex] && !cell.dataset.input) {
                    fixedRightWidth += width;
                    fixedRightRow[rightIndex].style.width = result;
                    fixedRightRow[rightIndex].style.maxWidth = result;
                    fixedRightHeadRow[rightIndex].style.width = width.toFixed(2) + 'px';
                    fixedRightHeadRow[rightIndex].style.maxWidth = width.toFixed(2) + 'px';
                }
            }

            if (fixedRightWidth) {
                refs.rightContainer.style.width = fixedRightWidth + 'px';
            }

            if (fixedLeftRow || fixedRightRow) {
                var getBoundingClientRect = refs.container.getBoundingClientRect;
                var height = getBoundingClientRect ? refs.container.getBoundingClientRect().height : refs.container.offsetHeight;
                var haveVerticalScrollBar = refs.container.offsetWidth < refs.container.scrollWidth;
                var fixedTableHeight = height - (haveVerticalScrollBar ? scrollBarWidth : 0);
                refs.leftContainer.style.height = fixedTableHeight + 'px';
                refs.rightContainer.style.height = fixedTableHeight + 'px';
                var tbody = refs.tbody.childNodes;
                var ltbody = refs.ltbody && refs.ltbody.childNodes;
                var rtbody = refs.rtbody && refs.rtbody.childNodes;
                var headHeight = getComputedStyle(refs.thead._thead).height;
                if (refs.lthead) refs.lthead._thead.style.height = headHeight;
                if (refs.rthead) refs.rthead._thead.style.height = headHeight;
                for (var _i = 0; _i < tbody.length; _i++) {
                    var row = tbody[_i];
                    var _height = getComputedStyle(row).height;
                    if (ltbody && ltbody[_i]) {
                        ltbody[_i].style.height = _height;
                        ltbody[_i].style.maxHeight = _height;
                    }
                    if (rtbody && rtbody[_i]) {
                        rtbody[_i].style.height = _height;
                        rtbody[_i].style.maxHeight = _height;
                    }
                }
            }
        }
    }, {
        key: '_scrollHeader',
        value: function _scrollHeader(e) {
            this._instance.thead._header.scrollLeft = e.currentTarget.scrollLeft;
            if (this._instance.nested) this._instance.nested._header.scrollLeft = e.currentTarget.scrollLeft;
        }
    }, {
        key: '_scrollHeight',
        value: function _scrollHeight(e) {
            this._instance.leftContainer.scrollTop = e.currentTarget.scrollTop;
            if (e.currentTarget === this._instance.rightContainer) {
                this._instance.container.scrollTop = e.currentTarget.scrollTop;
            }
            if (e.currentTarget === this._instance.container) {
                this._instance.rightContainer.scrollTop = e.currentTarget.scrollTop;
            }
        }
    }, {
        key: '_tryRender',
        value: function _tryRender() {
            var _props2 = this.props;
            var isTree = _props2.isTree;
            var iskey = _props2.iskey;
            var isKey = _props2.isKey;
            var hashKey = _props2.hashKey;
            var selectRow = _props2.selectRow;
            var nestedHead = _props2.nestedHead;
            var _state = this.state;
            var leftColumnData = _state.leftColumnData;
            var rightColumnData = _state.rightColumnData;

            var warning = 'color:red';
            if (isTree && !(iskey || isKey || hashKey)) {
                throw new Error('You need choose one configuration to set key field: `iskey(isKey)` or `hashkey`!!');
            }

            if (!isTree && hashKey) {
                console.warn('%c!Warning: If you set props `isTree` to `false`, `hashKey` need to be false and set props `iskey(isKey)` instead!!', warning);
            }

            if (nestedHead.length && (leftColumnData.length || rightColumnData.length)) {
                console.warn('%c!Warning: Since you set props `nestedHead`, it\'s better not set `dataFixed` in `TreeHeadCol`', warning);
            }
            if (selectRow.mode !== 'none') {
                if (isTree) {
                    console.warn('%c!Warning: You need set prop `isTree` to `false`, if not `TreeTable` will not render select rows', warning);
                }
                if (selectRow.mode === 'radio' && selectRow.selected && selectRow.selected.length > 1) {
                    console.warn('%c!Warning: Since you set `selectRow.mode` to `radio`,' + '`selectRow.selected` should only have one child, if not `TreeTable` will use the first child of `selectRow.selected`', warning);
                }
            }
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            this._initColumnData(this.props);
            this._tryRender();
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this._adjustWidth();
            window.addEventListener('resize', this._adjustWidth.bind(this));
            this._instance.container.addEventListener('scroll', this._scrollHeader.bind(this));
            this._instance.container.addEventListener('scroll', this._scrollHeight.bind(this));
            this._instance.rightContainer.addEventListener('scroll', this._scrollHeight.bind(this));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this._adjustWidth.bind(this));
            var _instance = this._instance;
            var rightContainer = _instance.rightContainer;
            var container = _instance.container;

            container.removeEventListener('scroll', this._scrollHeader.bind(this));
            container.removeEventListener('scroll', this._scrollHeight.bind(this));
            rightContainer.removeEventListener('scroll', this._scrollHeight.bind(this));
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            this._adjustWidth.bind(this);
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            this._initColumnData(nextProps);

            var _initDictionary2 = initDictionary(nextProps);

            var data = _initDictionary2.data;
            var dictionary = _initDictionary2.dictionary;

            this.setState({
                dictionary: dictionary,
                renderedList: data,
                length: getDefLength(nextProps, this.state.length),
                allChecked: this._isAllChecked(data, nextProps.selectRow),
                crtPage: nextProps.pagination && nextProps.options.page || this.state.crtPage
            });
        }
    }, {
        key: 'handleToggle',
        value: function handleToggle(option) {
            var data = option.data;
            var open = option.open;
            var parent = option.parent;

            var that = this;
            var _props3 = this.props;
            var hashKey = _props3.hashKey;
            var clickToCloseAll = _props3.clickToCloseAll;
            var childrenPropertyName = _props3.childrenPropertyName;

            var keyName = this._getKeyName();
            var callback = function callback(data) {
                var childList = data && data[childrenPropertyName] || [];
                if (clickToCloseAll) {
                    childList = getAllKey(childList, hashKey, keyName, childrenPropertyName);
                }
                if (!open) {
                    that.setState(function (old) {
                        if (hashKey && !data[keyName]) data[keyName] = (0, _Util.uniqueID)();
                        old.dictionary.push(data[keyName]);
                        return old;
                    });
                } else {
                    that.setState(function (old) {
                        old.dictionary.splice(old.dictionary.indexOf(data[keyName]), 1);
                        clickToCloseAll && childList && childList.forEach(function (item) {
                            var index = old.dictionary.indexOf(item);
                            if (~index) {
                                old.dictionary.splice(index, 1);
                            }
                        });
                        return old;
                    });
                }
            };
            this.props.onArrowClick(open, data, callback, parent);
        }
    }, {
        key: 'handleSelectAll',
        value: function handleSelectAll(checked) {
            if (checked) {
                this.props.selectRow.onSelectAll(checked, this.state.renderedList.slice());
            } else {
                this.props.selectRow.onSelectAll(checked, []);
            }
        }
    }, {
        key: 'handleSort',
        value: function handleSort(sortField, order) {
            var _this2 = this;

            var _props4 = this.props;
            var remote = _props4.remote;
            var onSortChange = _props4.onSortChange;

            if (remote) {
                onSortChange(sortField, order);
            } else {
                (function () {
                    var renderedList = _this2.state.renderedList;


                    var list = renderedList.slice();

                    list.sort(function (a, b) {
                        var ValueA = a[sortField];
                        var ValueB = b[sortField];
                        if (order === 'asc') {
                            if (typeof ValueA === 'string') {
                                return ValueA.localeCompare(ValueB);
                            } else {
                                return ValueA < ValueB ? -1 : ValueA > ValueB ? 1 : 0;
                            }
                        } else {
                            if (typeof ValueB === 'string') {
                                return ValueB.localeCompare(ValueA);
                            } else {
                                return ValueB < ValueA ? -1 : ValueB > ValueA ? 1 : 0;
                            }
                        }
                    });

                    _this2.setState(function (old) {
                        old.order = order;
                        old.renderedList = list;
                        old.sortField = sortField;
                        return old;
                    });

                    onSortChange(sortField, order);
                })();
            }
        }
    }, {
        key: 'handleClick',
        value: function handleClick(page, sizePerPage) {
            this.setState(function (old) {
                old.crtPage = page;
                return old;
            });
            this.props.options.onPageChange(page, sizePerPage);
        }
    }, {
        key: 'handleFlip',
        value: function handleFlip(length) {
            var _props5 = this.props;
            var remote = _props5.remote;
            var options = _props5.options;

            var page = remote ? options.page : this.state.crtPage;
            if (!remote) {
                this.setState(function (old) {
                    old.length = length;
                    if (!remote && (page - 1) * length > old.renderedList.length) {
                        old.crtPage = 1;
                    }
                    return old;
                });
            }

            options.onPageChange && options.onPageChange(page, length);
            options.onSizePageChange && options.onSizePageChange(length);
        }
    }, {
        key: 'handleHover',
        value: function handleHover(hover) {
            this.setState(function (old) {
                old.isHover = hover;
                return old;
            });
        }
    }, {
        key: 'colgroupRender',
        value: function colgroupRender(data, mode) {
            var output = [];
            if (mode && mode !== 'none') {
                output.push(_react2['default'].createElement('col', { key: 'select', style: { textAlign: 'center', width: 30 } }));
            }
            data.map(function (item, index) {
                var style = {
                    width: item.width,
                    maxWidth: item.width,
                    textAlign: item.dataAlign,
                    display: item.hidden && 'none'
                };
                output.push(_react2['default'].createElement('col', { style: style, key: index }));
            });
            return output;
        }
    }, {
        key: 'rowsRender',
        value: function rowsRender(data, cols, level, parent, hideSelectColumn, right) {
            var _state2 = this.state;
            var isHover = _state2.isHover;
            var dictionary = _state2.dictionary;
            var _props6 = this.props;
            var hover = _props6.hover;
            var iskey = _props6.iskey;
            var isKey = _props6.isKey;
            var isTree = _props6.isTree;
            var hashKey = _props6.hashKey;
            var selectRow = _props6.selectRow;
            var hoverStyle = _props6.hoverStyle;
            var arrowRender = _props6.arrowRender;
            var startArrowCol = _props6.startArrowCol;
            var childrenPropertyName = _props6.childrenPropertyName;

            var isSelect = selectRow.mode && selectRow.mode !== 'none';
            var keyName = this._getKeyName();
            var output = [];

            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    var node = data[i];
                    if (hashKey && !node[keyName]) node[keyName] = (0, _Util.uniqueID)();
                    var key = node[keyName];
                    var opened = !!~dictionary.indexOf(key);
                    output.push(_react2['default'].createElement(_TreeRow2['default'], {
                        key: key,
                        data: node,
                        cols: cols,
                        colIndex: i,
                        level: level,
                        open: opened,
                        parent: parent,
                        isTree: isTree,
                        hashKey: hashKey,
                        iskey: iskey || isKey,
                        selectRow: selectRow,
                        hover: isHover === key,
                        hoverStyle: hoverStyle,
                        arrowRender: arrowRender,
                        isSelect: !isTree && isSelect,
                        hideSelectColumn: hideSelectColumn,
                        onClick: this.handleToggle.bind(this),
                        arrowCol: right ? null : startArrowCol,
                        childrenPropertyName: childrenPropertyName,
                        onMouseOut: hover ? this.handleHover.bind(this, null) : function () {},
                        onMouseOver: hover ? this.handleHover.bind(this, key) : function () {},
                        checked: selectRow.selected && (selectRow.mode === 'checkbox' ? !!~selectRow.selected.indexOf(key) : selectRow.selected[0] === key)
                    }));
                    if (opened) {
                        output = output.concat(this.rowsRender(node[childrenPropertyName], cols, level + 1, node, hideSelectColumn, right));
                    }
                }
            }
            return output;
        }
    }, {
        key: 'blankRender',
        value: function blankRender(data, colSpan, showText) {
            if (data.length) return null;
            return _react2['default'].createElement(
                'tr',
                null,
                _react2['default'].createElement(
                    'td',
                    { className: 'text-center', colSpan: colSpan },
                    showText && this.props.noDataText
                )
            );
        }
    }, {
        key: 'bodyRender',
        value: function bodyRender(data, height, selectRow) {
            var _this3 = this;

            var columnData = this.state.columnData;
            return _react2['default'].createElement(
                'div',
                { className: 'table-container table-body-container', style: { height: height || 'auto' },
                    ref: function ref(c) {
                        _this3._instance.container = c;
                    } },
                _react2['default'].createElement(
                    'table',
                    { className: 'table table-bordered table-striped table-hover', ref: function ref(c) {
                            _this3._instance.body = c;
                        } },
                    _react2['default'].createElement(
                        'colgroup',
                        { ref: function ref(c) {
                                _this3._instance.colgroup = c;
                            } },
                        this.colgroupRender(columnData, selectRow.hideSelectColumn ? 'none' : selectRow.mode)
                    ),
                    _react2['default'].createElement(
                        'tbody',
                        { ref: function ref(c) {
                                _this3._instance.tbody = c;
                            } },
                        this.blankRender(data, columnData.length, true),
                        this.rowsRender(data, columnData, 0, null, selectRow.hideSelectColumn)
                    )
                )
            );
        }
    }, {
        key: 'leftBodyRender',
        value: function leftBodyRender(data, selectRow) {
            var _this4 = this;

            var leftColumnData = this.state.leftColumnData;
            if (leftColumnData.length) {
                return _react2['default'].createElement(
                    'table',
                    { className: 'table table-bordered table-striped table-hover' },
                    _react2['default'].createElement(
                        'colgroup',
                        { ref: function ref(c) {
                                _this4._instance.left = c;
                            } },
                        this.colgroupRender(leftColumnData, selectRow.hideSelectColumn ? 'none' : selectRow.mode)
                    ),
                    _react2['default'].createElement(
                        'tbody',
                        { ref: function ref(c) {
                                _this4._instance.ltbody = c;
                            } },
                        this.blankRender(data, leftColumnData.length),
                        this.rowsRender(data, leftColumnData, 0, null, selectRow.hideSelectColumn)
                    )
                );
            }
        }
    }, {
        key: 'rightBodyRender',
        value: function rightBodyRender(data) {
            var _this5 = this;

            var rightColumnData = this.state.rightColumnData;
            if (rightColumnData.length) {
                return _react2['default'].createElement(
                    'table',
                    { className: 'table table-bordered table-striped table-hover', ref: function ref(c) {
                            _this5._instance.rightBody = c;
                        } },
                    _react2['default'].createElement(
                        'colgroup',
                        { ref: function ref(c) {
                                _this5._instance.right = c;
                            } },
                        this.colgroupRender(rightColumnData, 'none')
                    ),
                    _react2['default'].createElement(
                        'tbody',
                        { ref: function ref(c) {
                                _this5._instance.rtbody = c;
                            } },
                        this.blankRender(data, rightColumnData.length),
                        this.rowsRender(data, rightColumnData, 0, null, true, true)
                    )
                );
            }
        }
    }, {
        key: 'paginationTotalRender',
        value: function paginationTotalRender() {
            var _props7 = this.props;
            var data = _props7.data;
            var remote = _props7.remote;
            var options = _props7.options;
            var dataSize = _props7.dataSize;
            var pagination = _props7.pagination;

            if (pagination && options.paginationShowsTotal) {
                var len = remote ? options.sizePerPage : this.state.length;
                var current = remote ? (options.page - 1) * len : (this.state.crtPage - 1) * len;
                var start = remote ? current + 1 : Math.min(data.length, current + 1);
                var to = remote ? current + data.length : Math.min(data.length, current + len);
                return _react2['default'].createElement(
                    'div',
                    { style: { margin: '20px 0 0 20px ', display: 'inline-block' } },
                    options.paginationShowsTotal === true ? _react2['default'].createElement(
                        'div',
                        null,
                        '显示 ',
                        start,
                        ' 至 ',
                        to,
                        '条 共',
                        remote ? dataSize : data.length,
                        '条'
                    ) : options.paginationShowsTotal(start, to, dataSize)
                );
            }
        }
    }, {
        key: 'dropDownListRender',
        value: function dropDownListRender() {
            var _props8 = this.props;
            var remote = _props8.remote;
            var options = _props8.options;

            var sizePageList = options.sizePageList;
            var length = sizePageList && sizePageList.length;
            if (length > 1 || length === 1 && sizePageList[0] !== options.sizePerPage) {
                if (remote) {
                    return _react2['default'].createElement(
                        _DropdownList2['default'],
                        { list: sizePageList,
                            onClick: this.handleFlip.bind(this) },
                        options.sizePerPage
                    );
                } else {
                    return _react2['default'].createElement(
                        _DropdownList2['default'],
                        { list: sizePageList, onClick: this.handleFlip.bind(this) },
                        this.state.length
                    );
                }
            }
        }
    }, {
        key: 'pagingRender',
        value: function pagingRender() {
            var _props9 = this.props;
            var remote = _props9.remote;
            var options = _props9.options;
            var dataSize = _props9.dataSize;
            var pagination = _props9.pagination;

            if (pagination) {
                return _react2['default'].createElement(
                    'div',
                    { className: 'fr' },
                    remote ? _react2['default'].createElement(_Pagination2['default'], {
                        dataSize: dataSize,
                        current: options.page,
                        endLabel: options.endLabel,
                        prevLabel: options.prevLabel,
                        nextLabel: options.nextLabel,
                        startLabel: options.startLabel,
                        sizePerPage: options.sizePerPage,
                        paginationSize: options.paginationSize,
                        onPageChange: options.onPageChange
                    }) : _react2['default'].createElement(_Pagination2['default'], {
                        endLabel: options.endLabel,
                        current: this.state.crtPage,
                        prevLabel: options.prevLabel,
                        nextLabel: options.nextLabel,
                        sizePerPage: this.state.length,
                        startLabel: options.startLabel,
                        dataSize: this.props.data.length,
                        paginationSize: options.paginationSize,
                        onPageChange: this.handleClick.bind(this)
                    })
                );
            }
        }
    }, {
        key: 'pagingRowRender',
        value: function pagingRowRender() {
            var _props10 = this.props;
            var pagination = _props10.pagination;
            var options = _props10.options;
            var data = _props10.data;

            if (!pagination) return null;
            if (!data.length && options && options.hidePaginationWhileNoData) return null;
            return _react2['default'].createElement(
                'div',
                { className: 'row' },
                _react2['default'].createElement(
                    'div',
                    { className: 'col-sm-6' },
                    this.dropDownListRender(),
                    this.paginationTotalRender()
                ),
                _react2['default'].createElement(
                    'div',
                    { className: 'col-sm-6' },
                    this.pagingRender()
                )
            );
        }
    }, {
        key: 'titleRender',
        value: function titleRender() {
            var title = this.props.title;
            if (!title) return null;
            return _react2['default'].createElement(
                'div',
                { className: 'table-tree-title' },
                typeof title === 'function' ? title(this.props.data.slice()) : title
            );
        }
    }, {
        key: 'footerRender',
        value: function footerRender() {
            var footer = this.props.footer;
            if (!footer) return null;
            return _react2['default'].createElement(
                'div',
                { className: 'table-tree-footer' },
                typeof footer === 'function' ? footer(this.props.data.slice()) : footer
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var _props11 = this.props;
            var width = _props11.width;
            var isTree = _props11.isTree;
            var remote = _props11.remote;
            var height = _props11.height;
            var children = _props11.children;
            var sortName = _props11.sortName;
            var lineWrap = _props11.lineWrap;
            var selectRow = _props11.selectRow;
            var sortOrder = _props11.sortOrder;
            var nestedHead = _props11.nestedHead;
            var pagination = _props11.pagination;
            var _state3 = this.state;
            var order = _state3.order;
            var length = _state3.length;
            var crtPage = _state3.crtPage;
            var sortField = _state3.sortField;
            var allChecked = _state3.allChecked;
            var columnData = _state3.columnData;
            var renderedList = _state3.renderedList;
            var leftColumnData = _state3.leftColumnData;
            var rightColumnData = _state3.rightColumnData;


            var renderList = pagination && !remote ? sliceData(renderedList, crtPage, length) : renderedList;

            return _react2['default'].createElement(
                'div',
                { className: "react-tree " + lineWrap },
                this.titleRender(),
                !!nestedHead.length && _react2['default'].createElement(_NestedTreeHeader2['default'], {
                    ref: function ref(c) {
                        _this6._instance.nested = c;
                    }, isTree: isTree, nestedHead: nestedHead,
                    selectRow: selectRow, lineWrap: lineWrap,
                    cols: columnData
                }),
                _react2['default'].createElement(
                    'div',
                    { className: 'table-tree-wrapper', style: { width: width || '100%' } },
                    _react2['default'].createElement(
                        'div',
                        { className: 'table-tree' },
                        _react2['default'].createElement(
                            _TreeHeader2['default'],
                            {
                                ref: function ref(c) {
                                    _this6._instance.thead = c;
                                }, isTree: isTree,
                                onSelectAll: this.handleSelectAll.bind(this),
                                selectRow: selectRow, checked: allChecked,
                                sortOrder: remote ? sortOrder : order,
                                sortName: remote ? sortName : sortField,
                                onSort: this.handleSort.bind(this),
                                dataLength: renderedList.length
                            },
                            children
                        ),
                        this.bodyRender(renderList, height, selectRow)
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'table-tree table-fixed table-left-fixed' },
                        !!leftColumnData.length && _react2['default'].createElement(
                            _TreeHeader2['default'],
                            {
                                ref: function ref(c) {
                                    _this6._instance.lthead = c;
                                }, isTree: isTree,
                                left: leftColumnData.length,
                                dataLength: renderedList.length,
                                onSelectAll: this.handleSelectAll.bind(this),
                                selectRow: selectRow, checked: allChecked,
                                sortName: remote ? sortName : sortField,
                                sortOrder: remote ? sortOrder : order,
                                onSort: this.handleSort.bind(this)
                            },
                            children
                        ),
                        _react2['default'].createElement(
                            'div',
                            {
                                ref: function ref(c) {
                                    _this6._instance.leftContainer = c;
                                }, className: 'table-container table-body-container',
                                style: { height: height || 'auto' }
                            },
                            this.leftBodyRender(renderList, selectRow)
                        )
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'table-tree table-fixed table-right-fixed' },
                        !!rightColumnData.length && _react2['default'].createElement(
                            _TreeHeader2['default'],
                            {
                                ref: function ref(c) {
                                    _this6._instance.rthead = c;
                                }, isTree: isTree,
                                right: rightColumnData.length,
                                dataLength: renderedList.length,
                                sortName: remote ? sortName : sortField,
                                sortOrder: remote ? sortOrder : order,
                                onSort: this.handleSort.bind(this)
                            },
                            children
                        ),
                        _react2['default'].createElement(
                            'div',
                            { className: 'table-container table-body-container', style: { height: height || 'auto' },
                                ref: function ref(c) {
                                    _this6._instance.rightContainer = c;
                                } },
                            this.rightBodyRender(renderList)
                        )
                    ),
                    this.footerRender()
                ),
                this.pagingRowRender()
            );
        }
    }]);

    return TreeTable;
}(_react.Component);

exports['default'] = TreeTable;


TreeTable.defaultProps = {
    data: [],
    dataSize: 0,
    hover: true,
    isTree: true,
    uid: '__uid',
    remote: false,
    nestedHead: [],
    startArrowCol: 0,
    expandAll: false,
    pagination: false,
    onSortChange: _Util.empty,
    sortName: undefined,
    sortOrder: undefined,
    lineWrap: 'ellipsis',
    clickToCloseAll: true,
    childrenPropertyName: 'list',
    noDataText: _react2['default'].createElement(
        'span',
        null,
        '暂无数据'
    ),
    hoverStyle: { backgroundColor: '#f5f5f5' },
    selectRow: {
        mode: 'none',
        selected: [],
        onSelect: _Util.empty,
        onSelectAll: _Util.empty,
        bgColor: '#dff0d8',
        hideSelectColumn: false
    },
    options: {
        sizePerPage: 10,
        paginationSize: 6,
        sizePageList: [10],
        onPageChange: _Util.empty,
        onSizePageChange: _Util.empty
    },
    onArrowClick: function onArrowClick(opened, data, callback) {
        callback(data);
    }
};

TreeTable.propTypes = {
    data: _propTypes2['default'].array,
    remote: _propTypes2['default'].bool,
    hover: _propTypes2['default'].bool,
    uid: _propTypes2['default'].string,
    isTree: _propTypes2['default'].bool,
    hashKey: _propTypes2['default'].bool,
    iskey: _propTypes2['default'].string,
    isKey: _propTypes2['default'].string,
    expandAll: _propTypes2['default'].bool,
    dataSize: _propTypes2['default'].number,
    pagination: _propTypes2['default'].bool,
    arrowRender: _propTypes2['default'].func,
    onArrowClick: _propTypes2['default'].func,
    onSortChange: _propTypes2['default'].func,
    hoverStyle: _propTypes2['default'].object,
    expandRowKeys: _propTypes2['default'].array,
    startArrowCol: _propTypes2['default'].number,
    clickToCloseAll: _propTypes2['default'].bool,
    childrenPropertyName: _propTypes2['default'].string,
    nestedHead: _propTypes2['default'].arrayOf(_propTypes2['default'].array),
    lineWrap: _propTypes2['default'].oneOf(['ellipsis', 'break']),
    width: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]),
    height: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number]),
    title: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number, _propTypes2['default'].node, _propTypes2['default'].func, _propTypes2['default'].element]),
    footer: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number, _propTypes2['default'].node, _propTypes2['default'].func, _propTypes2['default'].element]),
    noDataText: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].number, _propTypes2['default'].node, _propTypes2['default'].func, _propTypes2['default'].element]),
    selectRow: _propTypes2['default'].shape({
        mode: _propTypes2['default'].oneOf(['none', 'radio', 'checkbox']),
        onSelect: _propTypes2['default'].func,
        bgColor: _propTypes2['default'].string,
        selected: _propTypes2['default'].array,
        onSelectAll: _propTypes2['default'].func,
        hideSelectColumn: _propTypes2['default'].bool
    }),
    options: _propTypes2['default'].shape({
        page: _propTypes2['default'].number,
        onPageChange: _propTypes2['default'].func,
        sizePerPage: _propTypes2['default'].number,
        sizePageList: _propTypes2['default'].array,
        onSizePageChange: _propTypes2['default'].func,
        paginationSize: _propTypes2['default'].number,
        hidePaginationWhileNoData: _propTypes2['default'].bool,
        paginationShowsTotal: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].func])
    })
};