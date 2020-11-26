/**
 * promise 形式的 getSetting
 */
export const getSetting = ()=>{
  return new Promise((resole,reject)=>{
    wx.getSetting({
      success:(result)=>{
        resole(result);
      },
      fail:(err)=>{
        reject(err);
      },
    });
    
  })
}
/**
 * promise 形式的 chooseAddress
 */
export const chooseAddress = ()=>{
  return new Promise((resole,reject)=>{
    wx.chooseAddress({
      success:(result)=>{
        resole(result);
      },
      fail:(err)=>{
        reject(err);
      },
    });
    
  })
}
/**
 * promise 形式的 openSetting
 */
export const openSetting = ()=>{
  return new Promise((resole,reject)=>{
    wx.openSetting({
      success:(result)=>{
        resole(result);
      },
      fail:(err)=>{
        reject(err);
      },
    });
    
  })
}
