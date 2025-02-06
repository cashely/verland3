import dayjs from "dayjs";
import { produce, Immutable } from 'immer';
import { nanoid } from 'nanoid';
import type { ZodSchema } from 'zod';

export function formatDate(date: Date | string | number): (timeMate: string) => string {
      return (timeMate) => {

            if (!timeMate) return "";
            return dayjs(date).format(timeMate);
      }
}

export function editArray<T>(data: T[], callback: (item: Immutable<T[]>) => void): T[] {
      return produce(data, (draft: Immutable<T[]>) => {
            callback(draft);
      });
}

export function getId(): string {
      return nanoid();
}

/**
 * @name 从本地存储中获取token
 */
export function getTokenFromLocalStorage(): string | undefined {
      return localStorage.getItem("token") || undefined;
}

/**
 * @name 写入token到本地存储
 */
export function setTokenToLocalStorage(token: string | undefined): void {
      if (!token) {
            return;
      }
      localStorage.setItem("token", token);
}

/**
 * @name 从本地存储中移除token
 */
export function removeTokenFromLocalStorage(): void {
      localStorage.removeItem("token");
}
/**
 * @name 设置本地语言
 */
export function setLocaleToLocalStorage(locale: string): void {
      localStorage.setItem("locale", locale) || 'zh';
}

/**
 * @name 获取本地语言
 */
export function getLocaleToLocalStorage(): string | null {
      return localStorage.getItem("locale");
}

/**
 * @name 导出document
 */
export function exportDocument(data: any) {
      const file = new File([data.schema.content], `${data.name}.json`, { type: 'json' });
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
}

/**
 * @name antd form表单结合zod验证
 */
export function formFieldValidator<T>(scehma: ZodSchema<any>, errorMessage?: string): () => { validator: (rule: any, value: T) => Promise<void> } {
      //返回一个验证器返回promise
      return () => {
            return {
                  validator(_: unknown, value: T) {
                        const result: any = scehma.safeParse(value);
                        if (result.success) {
                              return Promise.resolve();
                        } else {
                              return Promise.reject(errorMessage || result.error.issues[0]);
                        }
                  }
            }
      }
}


export function commaSeparated(data) {
  const poArr = data
    .replace(/，/g, ',')
    .replace(/\n/g, ' ')
    .split(data.replace(/，/g, ',').indexOf(',') > -1 ? ',' : ' ')
    .filter((item) => !(!item || item.replace(/^\s+|\s+$/g, '') === ''));
  return poArr.map((item) => item.trim()).join(',');
}
/**
 * @param {原始数组} originalArray
 * @param {数组对象里的key} key
 * @param {数组对象里的label} label
 * @returns
 */
export function changeKeys(originalArray, key, label) {
  // eslint-disable-next-line no-undefined
  if (originalArray === undefined) {
    return [];
  }
  const newArray = []; // 新数组
  // eslint-disable-next-line array-callback-return
  originalArray.map((item) => {
    const obj = {
      label: item[label],
      key: item[key],
      value: item[key],
    };
    newArray.push(obj);
  });
  return newArray;
}
export default {
  // cloneDeep,
  // 过滤输入内容
  commaSeparated,
  // 下载文件
  downloadAhref(href) {
    if (!href) return false;
    const aLink = document.createElement('a');
    aLink.href = href;
    aLink.target = '_blank';
    aLink.download = '';
    document.body.appendChild(aLink);
    aLink.click();
  },
  // 统一数组的key
  changeKeys,
  // 数据赋值
  getRenderDataByProp(originData, consultObj, isEmpty = true) {
    originData.forEach((ele) => {
      if (ele.prop === 'claimTime') return false;
      if (consultObj) {
        // eslint-disable-next-line no-unused-vars
        for (const k in consultObj) {
          if (k === ele.prop) {
            ele.value = isEmpty ? consultObj[k] : '-';
          }
        }
      } else {
        ele.value = '-';
      }
    });
  },
  setOptions(list, key, value) {
    list.forEach((item) => {
      if (item.model === key && key !== 'deliveryPlace') item.options = value;
      if (item.model === key && item.model === 'deliveryPlace') item.options = { children: value };
    });
  },
  // 树结构属性值修改
  mapTree(data) {
    const mapTree = (org) => {
      const haveChildren
        = Array.isArray(org.childList) && org.childList.length > 0;
      return {
        label: org.name,
        value: org.code,
        children: haveChildren ? org.childList.map((i) => mapTree(i)) : [],
      };
    };
    let result = data.map((org) => mapTree(org));
    return result;
  },
  // 根据字典来获取下拉数据 , itemCode = 'itemCode', itemName = 'itemName'
  async getDictionary() {
    const { data } = await window.apisMap.common.queryDictionary({
      businessCodeList: [
        'car',
        'purchase',
        'retail',
        'vehicleStatus',
        'registration',
        'retail',
      ],
    });
    return data;
  },
  // 得到词典
  getDictionaryOptions(
    businessCode,
    itemCode = 'itemCode',
    itemName = 'itemName'
  ) {
    const dictionary = JSON.parse(localStorage.getItem('dictionary'));
    if (!dictionary.length) {
      return [];
    }
    const filterData = dictionary.find(
      (ele) => ele.businessCode === businessCode
    );
    const result = filterData.categoryList.reduce((prev, current) => {
      prev[current.categoryCode] = this.changeKeys(
        current.itemList,
        itemCode,
        itemName
      );
      return prev;
    }, {});
    return result;
  },
  getZfoDictionary(businessCode) {
    const dictionary = JSON.parse(localStorage.getItem('zfoDictionary'))[
      businessCode
    ];
    return this.changeKeys(dictionary, 'code', 'name');
  },
  // 检查权限是否存在
  permissionCheck(permission) {
    // 获取缓存的权限
    const permissions
      = JSON.parse(localStorage.getItem('montgomeryPermissions')) || [];
    // 权限是否存在
    if (!permissions || permissions.length <= 0) {
      return false;
    }
    // 长度是否存在
    if (permission.length <= 0) {
      return false;
    }
    // 过滤指定权限
    let checkResult = permissions.filter((item) => item === permission);
    // 返回结果
    return checkResult.length > 0;
  },
  // 复制文本
  copyText(msg, self) {
    const save = function (e) {
      e.clipboardData.setData('text/plain', msg);
      e.preventDefault(); // 阻止默认行为
    };
    document.addEventListener('copy', save); // 添加一个copy事件
    document.execCommand('copy'); // 执行copy方法
    self.$message({ message: '复制成功', type: 'success' });
  },
  // 得到列表查询参数对象
  getListParams(self) {
    const params = {};
    self.formItems.forEach((item) => {
      if (item.model) {
        if (['datePicker', 'datetimerange'].includes(item.type) && item.value) {
          // eslint-disable-next-line prefer-destructuring
          if (item.isParamsObj) {
            params[item.model] = {
              begin: item.value[0] || '',
              end: item.value[1] || '',
            };
          } else {
            params[`${item.model}Start`] = item.value[0] || '';
            // eslint-disable-next-line prefer-destructuring
            params[`${item.model}End`] = item.value[1] || '';
          }
        } else if (item.type === 'input' && item.bindingConfig.isBatch) {
          params[item.model]
            = item.value && item.value.length ? item.value.split(',') : [];
        } else {
          // eslint-disable-next-line no-unused-expressions, no-undefined
          item.value !== undefined ? (params[item.model] = item.value) : '';
        }
      }
    });
    return params;
  },
  genUUID() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
  },

  // 下载流
  downloadByStream(stream, filename) {
    const blob = new Blob([stream]);
    const eLink = document.createElement('a');
    eLink.download = filename;
    eLink.style.display = 'none';
    eLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eLink);
    eLink.click();
    URL.revokeObjectURL(eLink.href);
    document.body.removeChild(eLink);
  },
  // 值转换
  seValueToBar(data) {
    // eslint-disable-next-line no-unused-vars
    for (let key in data) {
      data[key] = data[key] || '-';
    }
  },

  // 导出
  exportListTable(params, requestUrl, fileName, self) {
    self.exportLoading = true;
    return requestUrl(params)
      .then((res) => {
        this.downloadByStream(res.data, `${fileName}.xlsx`);
        self.exportLoading = false;
      })
      .catch(() => {
        self.exportLoading = false;
      });
  },
  // 导出
  // eslint-disable-next-line consistent-this
  exportList(params, requestUrl, fileName, that) {
    return requestUrl(params)
      .then((res) => {
        that.$refs.ListQueryFormZeeKr.exportLoading = false;
        this.downloadByStream(res.data, `${fileName}.xlsx`);
        // eslint-disable-next-line no-unused-vars
      })
      .catch((error) => {
        that.$refs.ListQueryFormZeeKr.exportLoading = false;
      });
  },
  // 批量导入文件
  async submitUpload(file, self) {
    const params = {
      sysCode: self.basicConfig.sysCode,
      templateType: self.basicConfig.templateType,
      fileUrl: file,
    };
    const res
      = self.basicConfig.sysCode === 'car'
        ? await window.apisMap.common.importCarExcel(params)
        : await window.apisMap.common.importExcel(params);
    self.uploadVisible = false;
    if (res.code === 200) {
      if (res.data && res.data.errorUrl) {
        self.$message({
          type: 'warning',
          duration: 7000,
          message: `${self.basicConfig.title} 失败数据已为您自动下载！`,
        });
        window.location = res.data.errorUrl;
      } else {
        self.$message({
          type: 'success',
          duration: 5000,
          message: `${self.basicConfig.title} 操作成功！`,
        });
      }
    }
  },
  getMenuList() {
    let montgomeryUserRouters = JSON.parse(
      localStorage.getItem('montgomeryUserRouters') || '[]'
    );
    let menuItems = [];
    montgomeryUserRouters.forEach((item) => {
      menuItems.push(item.urlPath);
      item.children
        && item.children.forEach((ele) => {
          menuItems.push(ele.urlPath);
          ele.children
            && ele.children.forEach((list) => {
              menuItems.push(list.urlPath);
            });
        });
    });
    return menuItems;
  },
  // 新开窗口跳转
  goPageBlank(path, query, self) {
    if (Object.values(query).includes('-')) {
      return self.$message.warning('当前信息缺失');
    }
    // this.$router.push({ path, query });
    query.href = window.location.href;
    let routeData = self.$router.resolve({ path: path, query });
    window.open(routeData.href, '_blank');
  },
  getRateData(array) {
    if (array.length) {
      array.forEach((listItem) => {
        listItem.rateDesc = [];
        listItem.batteryRate.forEach((batteryItem) => {
          batteryItem.batteryBrand.forEach((ele) => {
            ele.desc = `${ele.featureName}${ele.rate}%`;
          });
          batteryItem.descArr = batteryItem.batteryBrand.map((ele) => ele.desc);
          listItem.rateDesc.push(
            `${batteryItem.carVersionName} (${batteryItem.descArr.join(',')}) `
          );
          listItem.rateDescDetail = listItem.rateDesc.join('<br/>');
          listItem.rateDes = listItem.rateDesc.join(' ; ');
        });
      });
    } else {
      array = [];
    }
    return array;
  },
  // 传入一个数组
  // 按照特定方式格式化
  sortArr(arr, str) {
    let _arr = [];
    let _t = [];
    // 临时的变量
    let _tmp;
    // 按照特定的参数将数组排序将具有相同值得排在一起
    arr = arr.sort((a, b) => {
      let s = a[str];
      let t = b[str];

      return s < t ? -1 : 1;
    });

    if (arr.length) {
      _tmp = arr[0][str];
    }
    // 将相同类别的对象添加到统一个数组
    // eslint-disable-next-line no-unused-vars
    for (let i in arr) {
      if (arr[i][str] === _tmp) {
        _t.push(arr[i]);
      } else {
        _tmp = arr[i][str];
        _arr.push(_t);
        _t = [arr[i]];
      }
    }
    // 将最后的内容推出新数组
    _arr.push(_t);
    return _arr;
  },
  // eslint-disable-next-line no-dupe-keys
  genFilesMap(files) {
    const filesMap = {};
    files.keys().forEach((key) => {
      filesMap[key.replace(/\//g, '_').slice(2).slice(0, -3)]
        = files(key).default;
    });
    return filesMap;
  },
  // 页面初始化
  pageInit(pageNum, pageSize, tableSelectedData, self) {
    self.page.pageNum = pageNum;
    self.page.pageSize = pageSize;
    if (self.tableSelectedData) self.tableSelectedData = tableSelectedData;
    self.onChangeListQueryForm(self.formItems);
  },
  // 切换页码和条数
  onLoadPageForTable(data, self) {
    self.page.pageNum = data.pageNum;
    self.page.pageSize = data.pageSize || self.page.pageSize;
    self.getList();
  },
  // 根据字典来获取下拉数据
  getOptsByDictionary(key) {
    const dictionary = JSON.parse(localStorage.getItem('eisenhowerDictionary'));
    const opt = dictionary.find((ele) => ele.key === key)?.items;
    return opt ? this.changeKeys(opt, 'code', 'name') : [];
  },
  // 车型
  model(list) {
    window.apisMap.common.model({}).then((res) => {
      this.setOptions(
        list,
        'modelNameList',
        this.changeKeys(res.data, 'model', 'modelName')
      );
    });
  },
  // 获取交付中心
  queryDealerByDivision(list, divisionCodeList) {
    return window.apisMap.common
      .queryDealerByDivision({
        divisionCodeList: divisionCodeList.toString() || '',
      })
      .then((res) => {
        this.setOptions(
          list,
          'dealerCodeList',
          this.changeKeys(res.data, 'dealerCode', 'dealerName')
        );
      });
  },
  // 始发仓库
  getFromWarehouseCodeList(list) {
    window.apisMap.common.queryWarehouseByType({}).then((res) => {
      this.setOptions(
        list,
        'fromWarehouseCodeList',
        this.changeKeys(res.data, 'warehouseCode', 'warehouseName')
      );
    });
  },
  getSystemName() {
    // eslint-disable-next-line no-unused-vars
    let systemName = '';
    let system = navigator.userAgent.toLowerCase();
    //判断android ios windows
    let android = system.indexOf('android');
    let iphone = system.indexOf('iphone');
    let ipad = system.indexOf('ipad');
    let windows = system.indexOf('windows');
    let isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (android !== -1) {
      systemName = 'android';
    }
    if (iphone !== -1 || ipad !== -1 || isMac) {
      systemName = 'ios';
    }
    if (windows !== -1) {
      systemName = 'windows';
    }
    return systemName;
  },
  onChangeListQueryForm(self) {
    self.listQuery = {};
    self.formItems.forEach((item) => {
      if (item.type === 'input' && item.value !== '') {
        self.listQuery[item.model]
          = item.value && item.value.length ? item.value.split(',') : [];
      }
      if (item.type === 'select' && item.value && item.value.length) {
        self.listQuery[item.model] = item.value;
      }
      if (item.type === 'datePicker' && item.value && item.value.length) {
        self.listQuery[`${item.model}Start`] = this.cloneDeep(item.value[0]);
        self.listQuery[`${item.model}End`] = this.cloneDeep(item.value[1]);
      }

      if (item.model === 'dealerSelf') {
        if (item.value === 1) {
          self.listQuery.dealerSelf = true; // 是否门店自提
        } else if (item.value === 0) {
          self.listQuery.dealerSelf = false;
        }
      }
      if (item.model === 'addressIsComplete') {
        if (item.value === 1) {
          self.listQuery.addressIsComplete = true; // 送达方地址是否完整
        } else if (item.value === 0) {
          self.listQuery.addressIsComplete = false;
        }
      }
    });
    self.getList();
  },
  arrayToTree(arr, parentNo = 'Root') {
    if (!Array.isArray(arr) || !arr.length) return [];
    let newArr = [];
    arr.forEach((item) => {
      if (item.parentNo === parentNo) {
        const data = {
          ...item,
          children: this.arrayToTree(arr, item.configTypeNo),
        };
        if (data.children && data.children.length === 0) {
          delete data.children;
        } else if (!Object.keys(data).includes('isEdit')) {
          data.isEdit = false;
        }
        newArr.push(data);
      }
    });
    return newArr;
  },
  arrayToTree2(arr, parentNo = 'Root') {
    if (!Array.isArray(arr) || !arr.length) return [];
    let newArr = [];
    arr.forEach((item) => {
      if (item.parentNo === parentNo) {
        const data = {
          ...item,
          children: this.arrayToTree2(arr, item.featureCode),
        };
        if (data.children && data.children.length === 0) {
          delete data.children;
        }
        newArr.push(data);
      }
    });
    return newArr;
  },
  treeToArray(tree) {
    if (!Array.isArray(tree) || !tree.length) throw new Error('请传入数组');
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].children) {
        tree = tree.concat(tree[i].children);
      }
    }
    return tree;
  },
  treeToArray2(tree) {
    if (!Array.isArray(tree) || !tree.length) throw new Error('请传入数组');
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].childList) {
        tree = tree.concat(tree[i].childList);
      }
    }
    return tree;
  },
  treeToArray3(tree) {
    if (!Array.isArray(tree) || !tree.length) throw new Error('请传入数组');
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].childrenList) {
        tree = tree.concat(tree[i].childrenList);
      }
    }
    return tree;
  },
  arrayToTree3(arr, pid) {
    if (!Array.isArray(arr) || !arr.length) return [];
    let newArr = [];
    arr.forEach((item) => {
      if (`${item.pid}` === `${pid}`) {
        const data = { ...item, children: this.arrayToTree3(arr, item.id) };
        if (data.children && data.children.length === 0) {
          delete data.children;
        }
        newArr.push(data);
      }
    });
    return newArr;
  },
  //封装一个数组排序方法
  compare(key, desc) {
    //key:  用于排序的数组的key值
    //desc： 布尔值，为true是升序排序，false是降序排序
    return function (a, b) {
      let value1 = a[key];
      let value2 = b[key];
      if (desc === true) {
        // 升序排列
        return value1 - value2;
      }
      // 降序排列
      return value2 - value1;
    };
  },
  isArraySubset(subset, superset) {
    return subset.every((item) => superset.includes(item));
  },
  // previewFile(fileUrl) {
  //   const baseURL = new Set(['dev', 'sit', 'uat']).has(process.env.VUE_APP_ENV)
  //     ? 'https://gateway-int-sit.fda.com/filepreview/onlinePreview?url='
  //     : 'https://gateway-int.fda.com/filepreview/onlinePreview?url=';
  //   const index = fileUrl.indexOf('?');
  //   const frontPart = decodeURI(fileUrl.substring(0, index));
  //   const latterPart = fileUrl.substring(index + 1, fileUrl.length);
  //   const { Base64 } = require('js-base64');
  //   const url
  //     = baseURL + encodeURIComponent(Base64.encode(`${frontPart}?${latterPart}`));
  //   window.open(url, '_blank');
  // },
};
