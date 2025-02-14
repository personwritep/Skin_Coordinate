// ==UserScript==
// @name        Skin Coordinate
// @namespace        http://tampermonkey.net/
// @version        3.2
// @description        ブログスキン背景画像の差替えツール〔新旧タイプスキン対応版〕
// @author        Ameba Blog User
// @match        https://ameblo.jp/*
// @match        https://blog.ameba.jp/ucs/upload/srvimage*
// @match        https://blog.ameba.jp/ucs/editcss/*
// @match        https://blog.ameba.jp/ucs/skin/srvskinpreview*
// @match        https://blog.ameba.jp/ucs/customize/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @run-at        document-body
// @noframes
// @grant        none
// @updateURL        https://github.com/personwritep/Skin_Coordinate/raw/main/Skin_Coordinate.user.js
// @downloadURL        https://github.com/personwritep/Skin_Coordinate/raw/main/Skin_Coordinate.user.js
// ==/UserScript==


let ua=0; // Chromeの場合のフラグ
let agent=window.navigator.userAgent.toLowerCase();
if(agent.indexOf('firefox') > -1){ ua=1; } // Firefoxの場合のフラグ

let task=0; // メイン ON/OFF
let active=-1; // 編集ボタン選択
let g_open=0; // サブパネル ON/OFF
let hk=3; // 編集対象要素のデータベース上のインデックス
let last_hk=3; // Round Selector の初期インデックス
let b_param;


let target=document.querySelector('head');
let monitor=new MutationObserver(catch_key);
monitor.observe(target, { childList: true });

catch_key();

function catch_key(){
    let sp=document.querySelector('.skin-page'); // 新タイプスキン
    let sb=document.querySelector('.skinBody'); // 旧タイプスキン
    if(sp || sb){ // ページ表示エリアの取得が条件
        document.addEventListener("keydown", check_key);
        function check_key(event){
            let gate=-1;
            if(event.altKey==true){
                if(event.keyCode==118){
                    event.preventDefault(); gate=1; }} // ショートカット「Alt＋F7」

            if(gate==1){
                event.stopImmediatePropagation();
                event.preventDefault();
                main(); }} // ツールの実効関数
    }} // catch_key



function main(){
    if(task==0){ // 初回の起動時のみ実行
        task=1;
        preset_db();
        div_db();
        //       let write_json=JSON.stringify(b_param); // db内容の確認用メンテナンスコード ⭕
        //       localStorage.setItem('SkinCoordinate', write_json); // ローカルストレージ 保存
    }
    if(task==1){
        task=2;
        panel1_disp();
        active_disp();
        coordinate(); }
    else if(task==2){
        task=1;
        un_view(hk);
        panel1_remove();
        panel2_remove(); }}



function preset_db(){
    let sp=document.querySelector('.skin-page'); // 新タイプスキン
    let sb=document.querySelector('.skinBody'); // 旧タイプスキン

    if(sp){
        b_param=[
            [0, '', 0, 0, 0, 0, 0, 0, 0, 100, 0],
            [0, 'html', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, 'body', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-bgHeader', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-bgHeader > div', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-bgHeader > div::after', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-bgHeader::before', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-bgHeader::after', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-headerTitle', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-page', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-page::before', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-blogHeaderNav', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-blogHeaderNavInner', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-message::before', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-message::after', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-paging', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-btnPaging', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-bgMain', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-entry', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-entry::after', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-entryTitle', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-entryTitle::before', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-entryTitle::after', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-blogMainInner::before', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-blogMainInner::after', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-timeline', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-timelineItem', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-tileItem .skin-bgQuiet', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '[data-uranus-component="imageFrame"]', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-bgMain [data-uranus-component="tileItemBody"]', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-blogFooterNavInner', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-widgetTitle', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-widgetTitle::before', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-widget::before', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-widget::after', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-btn', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-btnSidePrimary', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skin-btnSide', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, 'footer', 0, 0, 50, 50, 0, 0, 0, 100, 0]]; }

    // b_param[n][0] 　0:デフォルト 1:アレンジCSS適用
    // b_param[n][1] 　対象要素のCSSセレクタ
    // b_param[n][2] 　ユーザーの背景画像SRC
    // b_param[n][3] ～ b_param[n][7] 　背景プロパティ
    // b_param[n][8] 　ユーザー背景色カラーコード
    // b_param[n][9] 　ユーザー背景色透過度
    // b_param[n][10] 　ユーザー背景色の非優先設定

    if(sb){
        b_param=[
            [0, '', 0, 0, 0, 0, 0, 0, 0, 100, 0],
            [0, 'html', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, 'body', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skinBody', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skinBody::before', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skinImgBtnS', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skinSimpleBtn', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skinArticle .skinArticleHeader', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skinArticle .skinArticleHeader2', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skinMenuTitle', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skinSubHr', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, '.skinSubList li', 0, 0, 50, 50, 0, 0, 0, 100, 0],
            [0, 'footer', 0, 0, 50, 50, 0, 0, 0, 100, 0]]; }}


function div_db(){ // 背景画像のある対象要素のセレクタ・初期値の生成と配列への追加
    let div_ele=document.querySelectorAll('div');

    for(let k=0; k<div_ele.length; k++){
        let cumpStyle=window.getComputedStyle(div_ele[k], null);
        if(cumpStyle.backgroundImage!='none' || cumpStyle.backgroundColor!='rgba(0, 0, 0, 0)'){
            if(get_selector(div_ele[k])){
                let selector=get_selector(div_ele[k]);
                let same=0;
                for(let d=0; d<b_param.length; d++){
                    if(b_param[d][1]==selector){
                        same=1;
                        break; }}
                if(same==0){
                    let target_selector=selector;
                    b_param.push( [0, target_selector, 0, 0, 50, 50, 0, 0, 0, 100, 0]); }}}}
} // div_db()


function get_selector(ele){
    let id_selector=ele.getAttribute('id');
    if(id_selector!=null){
        return '#'+ id_selector; }
    else{
        let class_selector=ele.className.split(' ')[0];
        if(class_selector==''){
            return false; }
        else {
            return '.'+ class_selector; }}}



function panel1_disp(){
    let help_url='https://ameblo.jp/personwritep/entry-12610126303.html';
    let help_SVG=
        '<svg class="sc_help" height="24" width="24" viewBox="0 0 210 220">'+
        '<path d="M89 22C71 25 54 33 41 46C7 81 11 142 50 171C58 177 68 182 78 '+
        '185C90 188 103 189 115 187C126 185 137 181 146 175C155 169 163 162 169 '+
        '153C190 123 189 80 166 52C147 30 118 18 89 22z" style="fill: #eee;"></path>'+
        '<path d="M67 77C73 75 78 72 84 70C94 66 114 67 109 83C106 91 98 95 93 '+
        '101C86 109 83 116 83 126L111 126C112 114 122 108 129 100C137 90 141 76 '+
        '135 64C127 45 101 45 84 48C80 49 71 50 68 54C67 56 67 59 67 61L67 77M'+
        '85 143L85 166L110 166L110 143L85 143z" style="fill:#000;"></path>'+
        '</svg>';

    let panel=
        '<section id="panel1">'+
        '<a href="'+ help_url +'" rel="noopener noreferrer" target="_blank">'+
        help_SVG +'</a>'+
        '<input id="b1" type="submit" value="Html">'+
        '<input id="b2" type="submit" value="Body">'+
        '<input id="b0" type="submit" value="Round Selector">'+
        '<input id="a1" type="submit" value="S">'+
        '<input id="a2" type="submit" value="✜">'+
        '<input id="upload" type="submit" value="Image Upload">'+
        '<input id="get_css" type="submit" value="Get CSS">'+
        '<input id="css_edit" type="submit" value="CSS Editor">'+
        '<style>'+
        '#panel1 { position: fixed; bottom: 90px; left: calc(50% - 490px); '+
        'padding: 15px 0 15px 20px; background: rgba(0, 95, 86, 0.8); '+
        'border: 2px solid #fff; border-radius: 4px; width: 980px; z-index: 10; } '+
        '#panel1 input { font: normal 16px meiryo; color: #000; '+
        'margin-right: 20px; padding: 4px 6px 2px; } '+
        '.sc_help { margin: 0 15px -7px -8px; } '+
        '#b0, #b1, #b2  { outline: none; } '+
        '#b1, #b2 { width: 105px; padding-left: 10px !important; } '+
        '#b0 { padding-left: 15px !important; width: 240px; text-align: left; } '+
        '#a1, #a2 { width: 28px; } '+
        '#a2 { text-indent: -1px; margin-right: 30px !important; } '+
        '#upload, #get_css, #css_edit '+
        '{ border: 2px solid #07c5b4; background: #3df7e5; } '+
        '#upload, #get_css { margin-right: 5px !important; } '+
        '#css_edit { margin-right: 0 !important; } ';

    if(ua==1){
        panel+='#a2 { text-indent: -2px; } '; }

    panel+='</style></section>';

    if(!document.querySelector('#panel1')){
        document.body.insertAdjacentHTML('beforeend', panel); }

} // panel1_disp()


function panel1_remove(){
    let panel1=document.querySelector('#panel1');
    if(panel1){
        panel1.remove(); }}



function panel2_disp(){
    let panel2=
        '<section id="panel2">'+
        '<input id="g0" type="submit" value="Reset">'+
        '<input id="g1" type="text" placeholder="背景用の画像URLを入力">'+
        '<input id="g2" type="submit" value="Set URL">'+
        '<input id="g3" type="submit">'+
        '<div id="wper1"><input id="g4" type="number" min="0" max="100"></div>'+
        '<div id="wper2"><input id="g5" type="number" min="0" max="100"></div>'+
        '<input id="g6" type="submit">'+
        '<input id="g7" type="submit">'+
        '<div id="panel3">'+
        '<input id="c0" type="submit" value="Reset">'+
        '<input id="c1" type="text" placeholder="背景色コード" autocomplete="off">'+
        '<div id="wper3"><input id="c2" type="number" min="1" max="100"></div>'+
        '<input id="c3" type="submit" value="▼">'+
        '<input id="c4" type="submit" value="Set Color">'+
        '</div>'+
        '<input id="c5" type="color">'+
        '<style>'+
        '#panel2 { position: fixed; bottom: 160px; left: calc(50% - 490px); width: 980px; '+
        'padding: 15px 0 15px 20px; background: rgba(0, 95, 86, 0.8); '+
        'border: 2px solid #fff; border-radius: 4px; z-index: 10;} '+
        '#panel2 input { position: relative; font: normal 16px meiryo; color: #000; '+
        'margin-right: 12px; padding: 4px 6px 2px; } '+
        '#g1 { width: 300px; } #g3, #g6, #g7 { width: 70px; } #g5 { margin-left: -10px; } '+
        '#g4, #g5 { width: 54px; text-align: center; padding: 4px 5px 2px 1px !important; '+
        'filter: brightness(0.93); } '+
        '#wper1, #wper2 { position: relative; display: inline-block; } '+
        '#wper1::after, #wper2::after { content: "%"; position: absolute; right: 17px; top: 3px; '+
        'font-size: 16px; width: 20px; padding-top: 4px; background: #ededed; } '+
        '#g4:hover, #g5:hover { z-index: 1; } '+
        '#panel3 { position: absolute; top: 15px; left: 580px; } '+
        '#panel3 input { font: normal 16px meiryo; color: #000; '+
        'margin-right: 12px; padding: 4px 6px 2px; } '+
        '#c1 { width: 100px; } '+
        '#wper3 { position: relative; display: inline-block; } '+
        '#wper3::after { content: "%"; position: absolute; right: 17px; top: 3px; '+
        'font-size: 16px; width: 20px; padding-top: 4px; background: #ededed; } '+
        '#c2 { width: 54px; text-align: center; padding: 4px 5px 2px 1px !important; '+
        'filter: brightness(0.93); position: relative; } #c2:hover { z-index: 1; } '+
        '#c3 { width: 24px; text-indent: -4px; color: #999 !important; } '+
        '#c5 { position: absolute !important; left: calc(50% + 50px); z-index: -1; '+
        'height: 0; width: 0; padding: 0 !important; opacity: 0;  bottom: 60px; } ';

    if(ua==1){
        panel2+=
            '#wper1::after, #wper2::after, #wper3::after { top: 4px; } '+
            '#g1, #c1 { border: 2px solid #ccc; } #g4, #g5, #c2 { height: 28px; } '+
            '#c3 { text-indent: -5px; } '; }

    panel2+='</style></section>';

    if(!document.querySelector('#panel2')){
        document.body.insertAdjacentHTML('beforeend', panel2); }

} // panel2_disp()


function panel2_remove(){
    let panel2=document.querySelector('#panel2');
    if(panel2){
        panel2.remove(); }}



function active_disp(){
    let b1=document.querySelector('#b1');
    let b2=document.querySelector('#b2');
    let b0=document.querySelector('#b0');
    if(active==-1){
        b1.style.boxShadow='none';
        b1.style.outline='none';
        b2.style.boxShadow='none';
        b0.style.boxShadow='none'; }
    if(active==1){
        b1.style.boxShadow='0 0 0 4px #fff';
        b1.style.outline='2px dotted #000';
        b2.style.boxShadow='none';
        b0.style.boxShadow='none'; }
    if(active==2){
        b1.style.boxShadow='none';
        b1.style.outline='none';
        b2.style.boxShadow='0 0 0 2px #2196f3, 0 0 0 4px #fff';
        b0.style.boxShadow='none'; }
    if(active==0){
        b1.style.boxShadow='none';
        b1.style.outline='none';
        b2.style.boxShadow='none';
        b0.style.boxShadow='0 0 0 2px #2196f3, 0 0 0 4px #fff'; }}



function edited_disp(){
    let b0=document.querySelector('#b0');
    let b1=document.querySelector('#b1');
    let b2=document.querySelector('#b2');
    if(b_param[1][0]==1){
        b1.value='Html 🔵'; }
    else{
        b1.value='Html'; }
    if(b_param[2][0]==1){
        b2.value='Body 🔵'; }
    else{
        b2.value='Body'; }
    if(hk>2){
        if(b_param[hk][0]==1){
            b0.value='Round Selector\u2004\u2004'+
                (b_param.length-1) +'－'+(('0'+ hk).slice(-2))+' 🔵'; }
        else{
            b0.value='Round Selector\u2004\u2004'+
                (b_param.length-1) +'－'+(('0'+ hk).slice(-2)); }}}



function coordinate(){
    let b1=document.querySelector('#b1');
    let b2=document.querySelector('#b2');
    let b0=document.querySelector('#b0');
    let a1=document.querySelector('#a1');
    let a2=document.querySelector('#a2');
    let upload=document.querySelector('#upload');
    let get_css=document.querySelector('#get_css');
    let css_edit=document.querySelector('#css_edit');

    edited_disp();
    check_back_neo();


    b0.onclick=function(){
        if(active==1){
            un_view(1);
            if(b_param[1][0]==0){ // 編集フラグ 0
                undo_check(1); }}
        if(active==2){
            un_view(2);
            if(b_param[2][0]==0){ // 編集フラグ 0
                undo_check(2); }}

        if(active!=0){
            active=0; //「Round Selector」ON
            active_disp();
            hk=last_hk;
            view(hk); }
        else{
            if(g_open==1){
                g_open=0;
                undo_impose(0);

                if(b_param[hk][2]==0 && b_param[hk][8]==0){ // 背景設定がない場合
                    b_param[hk][0]=0; // 編集フラグ 0
                    undo_check(hk); }
                else { // ユーザー背景設定があると 編集フラグ1
                    b_param[hk][0]=1; } // 編集フラグ1
                edited_disp(); }
            else{
                active=-1; //「Round Selector」OFF
                active_disp();
                last_hk=hk;
                un_view(hk); }}}



    b1.onclick=function(){
        if(active==0){ // b0「Round Selector」が起動していたらOFFに
            last_hk=hk;
            un_view(hk); }
        if(active==2){
            un_view(2);
            if(b_param[2][0]==0){ // 編集フラグ 0
                undo_check(2); }}

        if(active!=1){
            active=1;
            active_disp();
            hk=1;
            view(1);
            check_back(1); }
        else{
            if(g_open==1){
                g_open=0;
                undo_impose(1);

                if(b_param[1][2]==0 && b_param[1][8]==0){ // 背景設定がない場合
                    b_param[1][0]=0; // 編集フラグ 0
                    undo_check(1); }
                else { // ユーザー背景設定があると 編集フラグ1
                    b_param[1][0]=1; }// 編集フラグ1
                edited_disp(); }
            else{
                active=-1;
                active_disp();
                un_view(1);

                if(b_param[1][0]==0){ // 編集フラグ 0
                    undo_check(1); }}}}



    b2.onclick=function(){
        if(active==0){ // b0「Round Selector」が起動していたらOFFに
            last_hk=hk;
            un_view(hk); }
        if(active==1){
            un_view(1);
            if(b_param[1][0]==0){ // 編集フラグ 0
                undo_check(1); }}

        if(active!=2){
            active=2;
            active_disp();
            hk=2;
            view(2);
            check_back(2); }
        else{
            if(g_open==1){
                g_open=0;
                undo_impose(2);

                if(b_param[2][2]==0 && b_param[2][8]==0){ // 背景設定がない場合
                    b_param[2][0]=0; // 編集フラグ 0
                    undo_check(2); }
                else { // ユーザー画像があると 編集フラグ1
                    b_param[2][0]=1; } // 編集フラグ1
                edited_disp(); }
            else{
                active=-1;
                active_disp();
                un_view(2);

                if(b_param[2][0]==0){ // 編集フラグ 0
                    undo_check(2); }}}}



    a1.onclick=function(){
        if(active>-1){
            show_size(hk); }}



    a2.onclick=function(){
        if(hk>2){
            ex_selector(hk); }}


    document.addEventListener('keydown', ex_key); // キー入力検知
    function ex_key(event){
        if(event.altKey==true && event.ctrlKey==true){ //「Ctrl + Alt」の押下
            event.preventDefault();
            event.stopImmediatePropagation(); // 絶対に必要
            ex_selector(hk); }}


    upload.onclick=function(){
        window.open('https://blog.ameba.jp/ucs/upload/srvimagelist.do',
                    null, 'top=50,left=100,width=830,height=640'); }


    get_css.onclick=function(){
        total_css(); }


    css_edit.onclick=function(){
        let open_url='https://blog.ameba.jp/ucs/editcss/srvcssupdateinput.do?sco';
        window.open(open_url, null, 'top=50,left=100,width=830,height=920'); }

} // coordinate()



function check_back_neo(){
    let b0=document.querySelector('#b0');
    if(active > -1){
        view(hk); } // 初期表示

    let press=0; // キーのチャタリング防止フラグ


    document.addEventListener('keydown', round_key); // キーコントロール検知
    document.addEventListener('keyup', reset_press); // キーの押下後を検知

    function round_key(event){
        if(event.keyCode==38){ //「↑」
            event.preventDefault();
            event.stopImmediatePropagation(); // 絶対に必要
            if(active==0){
                back(); }}
        if(event.keyCode==40){ //「↓」
            event.preventDefault();
            event.stopImmediatePropagation(); // 絶対に必要
            if(active==0){
                forward(); }}
        if(event.keyCode==32 && event.ctrlKey==false){ //「Space」で解除
            event.preventDefault();
            event.stopImmediatePropagation(); // 絶対に必要
            if(active>-1 && press==0){
                press=1;
                edit_in_out(); }} // 背景画像のアレンジ
        if(event.keyCode==32 && event.ctrlKey==true){ //「Ctrl + Space」背景削除を戻す
            event.preventDefault();
            event.stopImmediatePropagation(); // 絶対に必要
            if(active>-1 && press==0){
                press=1;
                edit_delete_back(); }}} // round_key()


    function reset_press(event){
        event.preventDefault();
        event.stopImmediatePropagation(); // 絶対に必要
        press=0; }


    function back(){
        if(hk>3 && g_open==0){
            un_view(hk);
            hk-=1;
            view(hk); }}


    function forward(){
        if(hk<b_param.length-1 && g_open==0){
            un_view(hk);
            hk+=1;
            view(hk); }}


    function edit_in_out(){
        if(g_open==0){
            g_open=1;
            edit_view(hk);
            impose(hk); }
        else if(g_open==1){ // edit_inを終了時にフラグ決定する
            g_open=0;
            undo_impose(hk);
            view(hk);
            if(b_param[hk][2]==0 && b_param[hk][8]==0){ // ユーザー背景設定がない場合
                b_param[hk][0]=0; // 編集フラグ 0
                undo_check(hk); }
            else { // ユーザー背景設定がある場合
                b_param[hk][0]=1; } // 編集フラグ 1
            edited_disp(); }}


    function edit_delete_back(){
        undo_check(hk); // 既存指定のタグがあれば全削除
        let target=document.querySelector(b_param[hk][1]);
        if(target){
            target.style.backgroundColor=''; }
        let b0=document.querySelector('#b0');

        if(b_param[hk][0]==0){
            b_param[hk][0]=1; // 背景設定が無い状態で「指定」有りにする
            b_param[hk][2]=0; // ユーザーの背景設定があれば削除
            b_param[hk][3]=0; // 以下背景データベースをリセット
            b_param[hk][4]=50;
            b_param[hk][5]=50;
            b_param[hk][6]=0;
            b_param[hk][7]=0;
            b_param[hk][8]=0; // ユーザーの背景設定があれば削除
            b_param[hk][9]=100;
            b_param[hk][10]=0;
            set_skintag2(hk); } // 実際の背景画像をクリア指定のタグを配置
        else if(b_param[hk][0]==1){ // クリア指定を解除
            b_param[hk][0]=0; // 通常の指定無しの状態にする → 元表示の再現
            b_param[hk][2]=0; // ユーザーの背景設定があれば削除（編集状態の場合）
            b_param[hk][3]=0; // 以下背景データベースをリセット（編集状態の場合）
            b_param[hk][4]=50;
            b_param[hk][5]=50;
            b_param[hk][6]=0;
            b_param[hk][7]=0;
            b_param[hk][8]=0; // ユーザーの背景設定があれば削除（編集状態の場合）
            b_param[hk][9]=100;
            b_param[hk][10]=0; }

        edited_disp();

        if(g_open==1){
            g_open=0;
            view(hk);
            undo_impose(hk); }}

} // check_back_neo()



function view(hk){
    let pseudo=0;
    let selector=b_param[hk][1];
    if(selector.includes('::before')){
        pseudo=1;
        selector=selector.replace('::before', ''); }
    if(selector.includes('::after')){
        pseudo=1;
        selector=selector.replace('::after', ''); }

    if(selector!=0){
        let target=document.querySelectorAll(selector);
        if(target.length!=0){
            for(let k=0; k<target.length; k++){
                if(hk>2){
                    if(pseudo==0){
                        target[k].style.boxShadow='rgb(33, 150, 243) 0 0 0 3px inset, '+
                            'rgb(255, 255, 255) 0 0 0 4px inset, '+
                            'rgba(0, 160, 255, 0.4) 0 0 0 200vw inset'; }
                    else {
                        target[k].style.boxShadow='rgb(255, 150, 0) 0 0 0 3px inset, '+
                            'rgb(255, 255, 255) 0 0 0 4px inset, '+
                            'rgba(0, 160, 255, 0.4) 0 0 0 200vw inset'; }
                    edited_disp(); }
                if(hk==2){
                    target[k].style.boxShadow='rgb(0, 160, 160) 0 0 0 5px inset, '+
                        'rgb(255, 255, 255) 0 0 0 6px inset, '+
                        'rgba(0, 160, 255, 0.4) 0 0 0 200vw inset'; }
                if(hk==1){
                    target[k].style.boxShadow='rgb(0, 0, 0) 0 0 0 5px inset, '+
                        'rgb(255, 255, 255) 0 0 0 6px inset, '+
                        'rgba(0, 160, 255, 0.4) 0 0 0 200vw inset'; }}}}}


function un_view(hk){
    let pseudo=0;
    let selector=b_param[hk][1];
    if(selector.includes('::before')){
        pseudo=1;
        selector=selector.replace('::before', ''); }
    if(selector.includes('::after')){
        pseudo=1;
        selector=selector.replace('::after', ''); }

    if(selector!=0){
        let target=document.querySelectorAll(selector);
        if(target.length!=0){
            for(let k=0; k<target.length; k++){
                target[k].style.boxShadow='none'; }}}}


function edit_view(hk){
    let pseudo=0;
    let selector=b_param[hk][1];
    if(selector.includes('::before')){
        pseudo=1;
        selector=selector.replace('::before', ''); }
    if(selector.includes('::after')){
        pseudo=1;
        selector=selector.replace('::after', ''); }

    if(selector!=0){
        let target=document.querySelectorAll(selector);
        if(target.length!=0){
            for(let k=0; k<target.length; k++){
                if(hk>2){
                    if(pseudo==0){
                        target[k].style.boxShadow='rgb(33, 150, 243) 0 0 0 3px inset, '+
                            'rgb(255, 255, 255) 0 0 0 4px inset'; }
                    else{
                        target[k].style.boxShadow='rgb(255, 150, 0) 0 0 0 3px inset, '+
                            'rgb(255, 255, 255) 0 0 0 4px inset'; }}
                if(hk==2){
                    target[k].style.boxShadow='rgb(0, 160, 160) 0 0 0 5px inset, '+
                        'rgb(255, 255, 255) 0 0 0 6px inset'; }
                if(hk==1){
                    target[k].style.boxShadow='rgb(0, 0, 0) 0 0 0 5px inset, '+
                        'rgb(255, 255, 255) 0 0 0 6px inset'; }}}}}



function check_back(n){
    set_skintag2(n);
    set_skintag3(n);
    set_skintag4(n);
    set_skintag6(n);
    set_skintag7(n); }
//    set_skintag8(n); } // ボタン「n」の要素に #skin_n2～#skin_n8 のstyleタグを生成し適用


function undo_check(n){
    remove_skintag(n, 2);
    remove_skintag(n, 3);
    remove_skintag(n, 4);
    remove_skintag(n, 6);
    remove_skintag(n, 7);
    remove_skintag(n, 8); } // 全ての #skin_n2～#skin_n8 のstyleタグを削除


function remove_skintag(n, idn){
    let id_selector='#skin_'+ String(n*10+idn);
    if(document.querySelector(id_selector)){
        document.querySelector(id_selector).remove(); }}



function impose(n){
    panel2_disp();

    let g0=document.querySelector('#g0');
    let g1=document.querySelector('#g1');
    let g2=document.querySelector('#g2');
    let g3=document.querySelector('#g3');
    let g4=document.querySelector('#g4');
    let g5=document.querySelector('#g5');
    let g6=document.querySelector('#g6');
    let g7=document.querySelector('#g7');
    let wper1=document.querySelector('#wper1');
    let wper2=document.querySelector('#wper2');
    let panel2=document.querySelector('#panel2');
    let c0=document.querySelector('#c0');
    let c1=document.querySelector('#c1');
    let c2=document.querySelector('#c2');
    let c3=document.querySelector('#c3');
    let c4=document.querySelector('#c4');
    let c5=document.querySelector('#c5');
    let wper3=document.querySelector('#wper3');


    let n_agent;
    if(n>2){
        n_agent=0; }
    else{
        n_agent=n; }
    let b_id='#b'+ n_agent;
    document.querySelector(b_id).style.background='#3bff5c';
    document.querySelector(b_id).style.borderStyle='solid';

    for(let k=0; k<3; k++){
        if(k!=n_agent){
            let b_id='#b'+k;
            document.querySelector(b_id).disabled=true; }}


    g1.value='';
    g1.disabled=false;
    g2.disabled=false;
    g3.disabled=true;
    g4.disabled=true;
    g5.disabled=true;
    g6.disabled=true;
    g7.disabled=true;

    g3.style.opacity='0';
    wper1.style.opacity='0';
    wper2.style.opacity='0';
    g6.style.opacity='0';
    g7.style.opacity='0';

    c1.value='';
    c2.disabled=true;
    wper3.style.opacity='0';
    c3.value='▼';
    c3.disabled=true;
    c3.style.opacity='0';


    if(b_param[n][2]!=0){
        g1.value=b_param[n][2]; // SRCを表示
        g1.disabled=true;
        g1.style.width='40px';
        g2.disabled=true;
        g2.style.position='absolute';
        g2.style.opacity='0';
        g3.disabled=false;
        g4.disabled=false;
        g5.disabled=false;
        g6.disabled=false;
        g7.disabled=false;

        g3.style.opacity='1';
        wper1.style.opacity='1';
        wper2.style.opacity='1';
        g6.style.opacity='1';
        g7.style.opacity='1';

        if(b_param[n][3]==0){ // Size値
            g3.value='Size A'; }
        else if(b_param[n][3]==1){
            g3.value='Size B'; }
        else if(b_param[n][3]==2){
            g3.value='Size C'; }
        g4.value=b_param[n][4]; // Psition値
        g5.value=b_param[n][5]; // Psition値
        if(b_param[n][6]==0){ // Repeat値
            g6.value='Repeat'; }
        else{
            g6.value='No Rep'; }
        if(b_param[n][7]==0){ // Fix Position値
            g7.value='Not Fix'; }
        else{
            g7.value='Fixed'; }}

    if(b_param[n][8]!=0){
        c1.value=b_param[n][8]; // カラー値
        c2.disabled=false;
        wper3.style.opacity='1';
        c2.value=b_param[n][9]; // 透過度
        c3.disabled=false;
        c3.style.opacity='1';
        if(b_param[n][10]==0){
            c3.value='▼'; }
        else{
            c3.value='▲'; }}

    check_back(n); // 全ての設定値を適用してページを再表示



    g0.onclick=function(){ // ユーザー画像設定をリセット
        g1.value='';
        g1.disabled=false;
        g1.style.width='300px';
        g2.disabled=false;
        g2.style.position='relative';
        g2.style.opacity='1';
        g3.disabled=true;
        g4.disabled=true;
        g5.disabled=true;
        g6.disabled=true;
        g7.disabled=true;

        g3.style.opacity='0';
        wper1.style.opacity='0';
        wper2.style.opacity='0';
        g6.style.opacity='0';
        g7.style.opacity='0';

        b_param[n][2]=0; // SRCリセット
        b_param[n][3]=0; // Size値リセット
        b_param[n][4]=50;
        b_param[n][5]=50;
        b_param[n][6]=0; // Repeat値リセット
        b_param[n][7]=0; // Fix Position値リセット
        img_param_disp();

        set_skintag2(n); // 画像・内枠線表示のリセット
        remove_skintag(n, 3);
        remove_skintag(n, 4);
        remove_skintag(n, 6);
        remove_skintag(n, 7); }



    g2.onclick=function(){
        if(b_param[n][2]==0 && g1.value!=''){ // Newの状態のみ入力可
            b_param[n][2]=g1.value; // SRCを取得
            g1.disabled=true;
            g1.style.width='40px';
            g2.disabled=true;
            g2.style.position='absolute';
            g2.style.opacity='0';
            g3.disabled=false;
            g4.disabled=false;
            g5.disabled=false;
            g6.disabled=false;
            g7.disabled=false;

            g3.style.opacity='1';
            wper1.style.opacity='1';
            wper2.style.opacity='1';
            g6.style.opacity='1';
            g7.style.opacity='1';

            img_param_disp();
            set_skintag2(n);
            set_skintag4(n); }}



    g3.onclick=function(){
        if(b_param[n][3]==0){
            b_param[n][3]=1;
            g3.value='Size B'; }
        else if(b_param[n][3]==1){
            b_param[n][3]=2;
            g3.value='Size C'; }
        else if(b_param[n][3]==2){
            b_param[n][3]=0;
            g3.value='Size A'; }
        g4.value=50; // position値をリセット
        b_param[n][4]=50;
        g5.value=50; // position値をリセット
        b_param[n][5]=50;

        let target=document.querySelector(b_param[n][1]);
        if(target){
            target.style.backgroundPosition='50% 50%'; }
        set_skintag3(n);
        set_skintag4(n); }



    g4.addEventListener('input', function(event){
        event.stopPropagation();
        b_param[n][4]=g4.value;
        let posx=g4.value +'%';

        let target=document.querySelector(b_param[n][1]);
        if(target){
            target.style.backgroundPositionX=posx; }});


    g4.addEventListener('change', function(event){
        event.stopPropagation();
        set_skintag4(n); });



    g5.addEventListener('input', function(event){
        event.stopPropagation();
        b_param[n][5]=g5.value;
        let posy=g5.value +'%';

        let target=document.querySelector(b_param[n][1]);
        if(target){
            target.style.backgroundPositionY=posy; }});


    g5.addEventListener('change', function(event){
        event.stopPropagation();
        set_skintag4(n); });



    g6.onclick=function(){
        if(b_param[n][6]==0){
            b_param[n][6]=1;
            g6.value='No Rep'; }
        else{
            b_param[n][6]=0;
            g6.value='Repeat'; }
        set_skintag6(n); }



    g7.onclick=function(){
        if(b_param[n][7]==0){
            b_param[n][7]=1;
            g7.value='Fixed'; }
        else{
            b_param[n][7]=0;
            g7.value='Not Fix'; }
        set_skintag7(n); }



    c0.onclick=function(){ // 背景色カラー設定のリセット
        c1.value='';
        b_param[n][8]=0; // 背景色カラー値リセット
        c2.value=100;
        c2.disabled=true;
        wper3.style.opacity='0';
        b_param[n][9]=100; // 背景色透過度リセット

        c3.disabled=true;
        c3.style.opacity='0';
        //        c3.value='▼';
        //        b_param[n][10]=0; // 優先設定はリセットしない

        let target=document.querySelector(b_param[n][1]);
        if(target){
            target.style.backgroundColor=c1.value; }
        remove_skintag(n, 8); }



    c1.onclick=function(event){
        event.stopPropagation();
        if(c1.value==0){
            b_param[n][8]='#ffffff';
            set_skintag8(n);
            color_dialogue(); }}



    c2.addEventListener('input', function(event){
        event.stopPropagation();
        let transparency=((255*c2.value)/100).toString(16).substr(0, 2);
        if(transparency.includes('.')){
            transparency='0'+ transparency.substr(0, 1)}
        c1.value=c1.value.substr(0, 7) + transparency;
        b_param[n][8]=c1.value;

        let target=document.querySelector(b_param[n][1]);
        if(target){
            target.style.backgroundColor=c1.value; }});


    c2.addEventListener('change', function(event){
        event.stopPropagation();
        set_skintag8(n); });



    c3.onclick=function(event){
        event.stopPropagation();
        if(b_param[n][2]==0){
            if(b_param[n][10]==0){
                b_param[n][10]=1;
                c3.value='▲'; }
            else{
                b_param[n][10]=0;
                c3.value='▼'; }
            remove_skintag(n, 2);
            set_skintag8(n); }}



    c4.onclick=function(event){
        event.stopPropagation();
        if(c1.value.length==7 || c1.value==''){
            color_dialogue(); }
        else if(c1.value.length==9){
            c1.value=c1.value.substr(0, 7);
            color_dialogue(); }}



    c5.addEventListener('input', function(event){
        event.stopPropagation();
        c1.value=c5.value;
        b_param[n][8]=c5.value;

        let target=document.querySelector(b_param[n][1]);
        if(target){
            target.style.backgroundColor=c5.value; }});


    c5.addEventListener('change', function(event){
        event.stopPropagation();
        set_skintag8(n); });



    function color_dialogue(){
        c4.style.pointerEvents='none';
        if(c1.value==''){
            c5.value='#ffffff'; }
        else{
            c5.value=c1.value; }
        b_param[n][8]=c1.value;
        c2.value=100;
        b_param[n][9]=100;
        c2.disabled=false;
        wper3.style.opacity='1';
        if(b_param[n][10]==0){
            c3.value='▼'; }
        else{
            c3.value='▲'; }
        c3.disabled=false;
        c3.style.opacity='1';

        let target=document.querySelector(b_param[n][1]);
        if(target){
            target.style.backgroundColor=c5.value; }

        c5.style.bottom='330px';
        setTimeout(()=>{
            c5.click();
        }, 40); }



    panel2.addEventListener('mouseup', function(event){
        event.stopPropagation();
        c5.style.bottom='60px';
        c4.style.pointerEvents='auto'; });



    function img_param_disp(){
        if(b_param[n][3]==0){ // Size値
            g3.value='Size A'; }
        else if(b_param[n][3]==1){
            g3.value='Size B'; }
        else if(b_param[n][3]==2){
            g3.value='Size C'; }
        g4.value=b_param[n][4]; // Psition値
        g5.value=b_param[n][5]; // Psition値
        if(b_param[n][6]==0){ // Repeat値
            g6.value='Repeat'; }
        else{
            g6.value='No Rep'; }
        if(b_param[n][7]==0){ // Fix Position値
            g7.value='Not Fix'; }
        else{
            g7.value='Fixed'; }}

} // impose()



function ex_selector(hk){
    let page_html=document.querySelector('html');
    let class_selector=page_html.className.split(' ')[0]; //「column」クラスを取得
    if(class_selector){
        if(!b_param[hk][1].includes(class_selector)){ // 既に追加していない事が条件
            let ex_sel='.'+ class_selector +' '+ b_param[hk][1];
            b_param[hk][1]=ex_sel; }}
    check_back(hk); }



function undo_impose(n){
    panel2_remove();
    g_open=0;

    let n_agent;
    if(n>2){
        n_agent=0; }
    else{
        n_agent=n; }
    let b_id='#b'+ n_agent;
    document.querySelector(b_id).style.background='';
    document.querySelector(b_id).style.borderStyle='';
    for(let k=0; k<3; k++){
        let b_id='#b'+k;
        document.querySelector(b_id).disabled=false; }}



function show_size(n){
    let area;
    let area_width;
    let area_height;

    if(!b_param[n][1].includes('::before') && !b_param[n][1].includes('::after')){
        area=document.querySelector(b_param[n][1]);
        area_width=area.getBoundingClientRect().width;
        area_height=area.getBoundingClientRect().height; }

    if(b_param[n][1].includes('::before')){
        area=document.querySelector(b_param[n][1].replace('::before', ''));
        area_width=getComputedStyle(area, '::before').width;
        area_height=getComputedStyle(area, '::before').height; }

    if(b_param[n][1].includes('::after')){
        area=document.querySelector(b_param[n][1].replace('::after', ''));
        area_width=getComputedStyle(area, '::after').width;
        area_height=getComputedStyle(area, '::after').height; }

    alert(
        '背景画像が表示される範囲のサイズ (px)\n\n　　'+
        area_width +' (w) × '+ area_height +' (h)\n\n'+
        '要素がウインドウ幅全体に拡がる場合は\n'+
        '背景幅も変化する事に注意してください'); }



function set_skintag2(n){
    let htm=document.querySelector('html');
    let css2='';
    let css8='';

    if(b_param[n][2]==0 && b_param[n][8]==0){ // ユーザー背景設定がない場合
        if(n!=1){ // プリセット「1」以外
            css2+=b_param[n][1] +' { background: none; }'; } // 元背景を非表示
        else{ // プリセット「1」
            css2+=b_param[n][1] +' { background: #fff; background-image: '+
                'linear-gradient(45deg, #ddd 25%, transparent 25%, '+
                'transparent 75%, #ddd 75%, #ddd), '+
                'linear-gradient(-45deg, #ddd 25%, transparent 25%, transparent 75%, '+
                '#ddd 75%, #ddd); background-size: 10px 10px; }'; }} // 特殊背景表示
    else{ // ユーザー背景設定がある場合 その内容を表示
        if(b_param[n][2]!=0){
            css2+=b_param[n][1] +' { background: url('+ b_param[n][2] +'); }'; }
        if(b_param[n][8]!=0){
            if(b_param[n][2]==0){ // ユーザー背景画像が無い場合
                if(b_param[n][10]==0){ //非優先設定なし（デフォルト）
                    css8+=b_param[n][1] +' { background: none; '+
                        'background-color: '+ b_param[n][8] +'; }'; }
                else{ // 非優先設定の場合
                    css8+=b_param[n][1] +' { background-color: '+ b_param[n][8] +'; }'; }}
            else{ // ユーザー背景画像がある場合
                css8+=b_param[n][1] +' { background-color: '+ b_param[n][8] +'; }'; }}}

    let style2=document.createElement('style');
    let s_id2='skin_'+ String(n*10+2);
    style2.setAttribute('id', s_id2);
    style2.innerHTML=css2;
    if(document.querySelector('#'+s_id2)){
        document.querySelector('#'+s_id2).remove(); }
    htm.appendChild(style2);

    if(css8!=''){
        let style8=document.createElement('style');
        let s_id8='skin_'+ String(n*10+8);
        style8.setAttribute('id', s_id8);
        style8.innerHTML=css8;
        if(document.querySelector('#'+s_id8)){
            document.querySelector('#'+s_id8).remove(); }
        htm.appendChild(style8); }}



function set_skintag3(n){
    let htm=document.querySelector('html');
    let css; // Size値指定

    if(b_param[n][3]==0){
        css=b_param[n][1] +' { background-size: ""; }'; }
    if(b_param[n][3]==1){
        css=b_param[n][1] +' { background-size: contain; }'; }
    if(b_param[n][3]==2){
        css=b_param[n][1] +' { background-size: cover; }'; }

    let style=document.createElement('style');
    let s_id='skin_'+ String(n*10+3);
    style.setAttribute('id', s_id);
    style.innerHTML=css;
    if(document.querySelector('#'+s_id)){
        document.querySelector('#'+s_id).remove(); }
    htm.appendChild(style); }



function set_skintag4(n){
    let htm=document.querySelector('html');

    let css;
    let posx=b_param[n][4];
    let posy=b_param[n][5];
    css=b_param[n][1] +' { background-position: '+ posx +'% '+ posy +'%; }';

    let style=document.createElement('style');
    let s_id='skin_'+ String(n*10+4);
    style.setAttribute('id', s_id);
    style.innerHTML=css;
    if(document.querySelector('#'+s_id)){
        document.querySelector('#'+s_id).remove(); }
    htm.appendChild(style); }



function set_skintag6(n){
    if(b_param[n][6]==1){
        let htm=document.querySelector('html');

        let css;
        css=b_param[n][1] +' { background-repeat: no-repeat; }';

        let style=document.createElement('style');
        let s_id='skin_'+ String(n*10+6);
        style.setAttribute('id', s_id);
        style.innerHTML=css;
        if(document.querySelector('#'+s_id)){
            document.querySelector('#'+s_id).remove(); }
        htm.appendChild(style); }
    else{
        let s_id='skin_'+ String(n*10+6);
        if(document.querySelector('#'+s_id)){
            document.querySelector('#'+s_id).remove(); }}}



function set_skintag7(n){
    if(b_param[n][7]==1){
        let htm=document.querySelector('html');
        let css;
        css=b_param[n][1] +' { background-attachment: fixed; }';

        let style=document.createElement('style');
        let s_id='skin_'+ String(n*10+7);
        style.setAttribute('id', s_id);
        style.innerHTML=css;
        if(document.querySelector('#'+s_id)){
            document.querySelector('#'+s_id).remove(); }
        htm.appendChild(style); }
    else{
        let s_id='skin_'+ String(n*10+7);
        if(document.querySelector('#'+s_id)){
            document.querySelector('#'+s_id).remove(); }}}



function set_skintag8(n){
    if(b_param[n][8]!=0){
        let htm=document.querySelector('html');
        let css8='';

        if(b_param[n][2]==0){ // ユーザー背景画像が無い場合
            if(b_param[n][10]==0){ //非優先設定なし（デフォルト）
                css8+=b_param[n][1] +' { background: none; '+
                    'background-color: '+ b_param[n][8] +'; }'; }
            else{ // 非優先設定の場合
                css8+=b_param[n][1] +' { background-color: '+ b_param[n][8] +'; }'; }}
        else{ // ユーザー背景画像がある場合
            css8+=b_param[n][1] +' { background-color: '+ b_param[n][8] +'; }'; }

        let style=document.createElement('style');
        let s_id='skin_'+ String(n*10+8);
        style.setAttribute('id', s_id);
        style.innerHTML=css8;
        if(document.querySelector('#'+s_id)){
            document.querySelector('#'+s_id).remove(); }
        htm.appendChild(style); }
    else{
        let s_id='skin_'+ String(n*10+8);
        if(document.querySelector('#'+s_id)){
            document.querySelector('#'+s_id).remove(); }}}



function total_css(){
    let css='';

    for(let k=1; k<b_param.length; k++){
        if(b_param[k][0]==1 && b_param[k][1]!=0){
            if(b_param[k][2]==0){
                if(b_param[k][8]==0){ // 元設定を無効にした背景透過指定
                    css+=b_param[k][1] +' { \n  background: none;\n}\n\n'; }
                else{ // ユーザー背景色を指定
                    if(b_param[k][10]==0){ //非優先設定なし（デフォルト）元設定を上書き
                        css+=b_param[k][1] +' { \n  background: none;\n  background-color: '+
                            b_param[k][8] +';\n}\n\n'; }
                    else{ // 非優先設定の場合 元設定を残す
                        css+=b_param[k][1] +' { \n  background-color: '+
                            b_param[k][8] +';\n}\n\n'; }}}

            if(b_param[k][2]!=0){ // ユーザー背景画像を指定
                css+=b_param[k][1] +' { \n  background: url('+ b_param[k][2] +');\n';
                if(b_param[k][3]==1){
                    css+='  background-size: contain;\n'; }
                else if(b_param[k][3]==2){
                    css+='  background-size: cover;\n'; }
                let posx=b_param[k][4];
                let posy=b_param[k][5];
                css+='  background-position: '+ posx +'% '+ posy +'%;\n';
                if(b_param[k][6]==1){
                    css+='  background-repeat: no-repeat;\n'; }
                if(b_param[k][7]==1){
                    css+='  background-attachment: fixed;\n'; }
                if(b_param[k][8]!=0){ // ユーザー背景色を指定
                    css+='  background-color: '+ b_param[k][8] +';\n'; }
                css+='}\n\n'; }
        }}

    copyClipboard(css);
    alert(
        ' 🟦 現在の背景画像の設定をクリップボードにコピーしました\n\n'+
        '　　CSS編集画面のコード末尾にペーストして「保存」すると\n'+
        '　　現在の背景画像のアレンジがブログページに反映します');

} // total_css()



function copyClipboard(str){ // クリップボードにコピーする関数
    let tmp_area=document.createElement("textarea");
    tmp_area.textContent=str;
    document.body.appendChild(tmp_area);
    tmp_area.select();
    let retVal=document.execCommand('copy');
    document.body.removeChild(tmp_area);
    return retVal; }



window.addEventListener('DOMContentLoaded', function(){
    let upl_index=document.querySelector('#uploadIndex');
    if(upl_index){ // 画像フォルダウインドウの場合に動作する
        upload_w(); }});


function upload_w(){
    let style=
        '<style id="skin_upload">'+
        '#globalHeader, #ucsHeader, .l-ucs-sidemenu-area, '+
        '.selectImg .numLabel, label[for*="image_title"], input.inputText, '+
        'input[type="checkbox"], #imageList .actionControl, #moreUpload, '+
        '#imageList .imageBox .btnDefault, #mailBlog, #ucsMainRight, '+
        '#footerAd, #globalFooter { display: none !important; } '+
        '#ucsContent { max-width: 810px; background: #fff; margin-bottom: 0; '+
        'border-radius: 0; } '+
        '#ucsContent::before { content: none; } '+
        '#ucsMain { font-size: 16px; padding-top: 14px; background: none; } '+
        '#ucsMainLeft { width: 808px !important; } '+
        '#ucsMainContent h1, #ucsMainLeft h1 { font: bold 21px Meiryo; '+
        'margin: 0 -16px 15px; padding: 4px 15px 8px; } '+

        '#uploadImgTitle h2 { font-size: 16px; padding-top: 4px; } '+
        '.comment { font-size: 16px; width: 16em; overflow: hidden; '+
        'white-space: nowrap; } '+
        '.selectImg:not(:nth-child(5)) { display: none; } '+
        '.selectImg .fileUp { width: 500px; padding: 10px; font-size: 16px; } '+
        'input#upload { font-size: 16px; padding: 1px 0 0; } '+
        '.imageBox { width: 187px; margin: 0; } '+
        '.imageBox .thickboxEditTitle { display: block; overflow: hidden; '+
        'width: 175px; } '+
        '.imageBox dt label { color: transparent; } '+
        '.imageBox img { height: 130px; width: auto; } '+
        'html { overflow-y: scroll !important; }'+
        '</style>';

    if(!document.querySelector('#skin_upload')){
        document.body.insertAdjacentHTML('beforeend', style); }

    let target3=document.querySelector('form[name="imageListForm"]');
    let monitor3=new MutationObserver(imagelist);
    monitor3.observe(target3, { childList: true });

    imagelist();

    function imagelist(){
        let imagebox_img=document.querySelectorAll('.imageBox img');
        for(let k=0; k<imagebox_img.length; k++){
            imagebox_img[k].parentNode.removeAttribute('href');
            let rsrc=imagebox_img[k].getAttribute('src');
            let src=rsrc.substring(0, rsrc.indexOf("?"));
            imagebox_img[k].setAttribute('src', src);

            imagebox_img[k].addEventListener('mousedown', function(event){
                event.stopImmediatePropagation();
                let gsrc=imagebox_img[k].getAttribute('src');
                copyClipboard(gsrc);

                imagebox_img[k].parentNode.style.outline='3px solid red';
                imagebox_img[k].parentNode.style.outlineOffset='-3px';
                setTimeout(()=>{
                    imagebox_img[k].parentNode.style.outline='none';
                }, 2000); }); }}
} // upload_w()



window.addEventListener('DOMContentLoaded', function(){
    let editCss=document.querySelector('#editCss');
    if(editCss){ //「CSSの編集」の画面で動作する
        edit_w();
        editcss(); }});


function edit_w(){
    let style=
        '<style id="edit_w">'+
        '#globalHeader, .l-ucs-sidemenu-area, #ucsMainRight, '+
        'ul.editTools , .infoArea , #footerAd, #globalFooter, #ucsHeader '+
        '{ display: none !important; } '+
        '#ucsContent { max-width: 810px; background: #fff; margin-bottom: 0; '+
        'border-radius: 0; } '+
        '#ucsContent::before { content: none; } '+
        '#ucsMain { font-size: 16px; padding-top: 14px; background: none; } '+
        '#ucsMainLeft { width: 808px !important; } '+
        '#ucsMainLeft h1 { font: bold 21px Meiryo; margin: 0 -16px 15px; '+
        'padding: 4px 15px 8px; } '+
        '.moreLink a { font-weight: bold; color: #000; } '+
        '.textInputArea .textarea1 { width: 715px !important; height: 320px; '+
        'font-size: 16px; } .limText { margin: 0; } '+
        'html { overflow-y: scroll !important; } '+
        '#editCss #ucsMain { padding: 14px 0 10px; } '+
        '#editCss #notes { font-size: 15px; } '+
        '#editCss #myframe { display: none; } '+
        '#editCss #contentsForm textarea { width: 720px !important; '+
        'height: 500px; } '+
        '#editCss .actionControl { padding-bottom: 20px; } '+
        '#editCss .actionControl .msg { margin: -35px 0 10px; }';

    if(!document.querySelector('#edit_w')){
        document.body.insertAdjacentHTML('beforeend', style); }

} // edit_w()



function editcss(){
    let blog_sw=
        '<input id="blog" type="submit" value="ブログ画面">'+
        '<style>'+
        '.textarea1 { font-size: 16px; } '+
        '.actionControl { padding-bottom: 30px; } '+
        'input[name="save_mode"], #blog { font: normal 16px Meiryo; width: 150px; '+
        'padding: 3px 8px 1px; color: #fff; cursor: pointer; -moz-appearance: none; } '+
        'input[name="save_mode"] { box-shadow: inset 0 0 0 40px #00a08e; } '+
        '#blog { margin-left: 30px; box-shadow: inset 0 0 0 40px #2196f3; }'+
        '</style>';

    let actionControl=document.querySelector('.actionControl');
    if(!document.querySelector('#blog') && actionControl){
        actionControl.insertAdjacentHTML('beforeend', blog_sw); }

    let blog=document.querySelector('#blog');
    let my_blog=document.querySelector('#ucsSubMenu li:last-child a');
    blog.onclick=function(){
        my_blog.click(); }

    let btnPrimary=document.querySelector('input[name="save_mode"]');
    btnPrimary.classList.remove('btnPrimary');

    let query=location.href.toString().slice(-4); // パネルからCSS編集を開いた場合
    if(query=='?sco'){
        let css_text=document.querySelector('#contentsForm textarea');
        css_text.scrollTop=css_text.scrollHeight; } // コードを最下部を表示する

} // editcss()
