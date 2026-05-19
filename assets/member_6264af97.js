function ajaxmemberProcess() {
	return false;
}

function call_member_ajax()
{
	Ajax.init("/cjs/ajax/ajax.member.php", null , 'GET' , null , false , false );
}

// ����	�� üũ
function com_member_formCheck()
{
	call_member_ajax();

	var	mform	 =	document.com_member;
	var	rsXml	 =	Ajax.rltXml();

	var	tempFrom =	"com_member";
	realMemberCheck(tempFrom);

//[CS,2009-12-30,Jeong Yong Hun] -��й�ȣ ��ȿ�� ó��
	var passwd = document.com_member.passwd.value;
	var checkResult = check_password_js_validate(passwd);
	if(checkResult == false) return false;

	var ssn_type = document.getElementsByName('ssn_type');

	if(ssn_type) {
	    var type = "1";

		for(var i=0; i<ssn_type.length; i++) {
			if(ssn_type[i].checked == true) {
				type = ssn_type[i].value;
				break;
			}
		}

		switch(type) {
			case '1' :
				FormCheck.setCheck(tempFrom, 'ssn1',	'y', '�ֹε�Ϲ�ȣ', 'num',	'6');
				FormCheck.setCheck(tempFrom, 'ssn2',	'y', '�ֹε�Ϲ�ȣ', 'personal_number', '7',	'ssn1');
                break;
			case '2' :
				FormCheck.setCheck(tempFrom, 'ssn1',	'y', '���ε�Ϲ�ȣ', 'num',	'6');
				FormCheck.setCheck(tempFrom, 'ssn2',	'y', '���ε�Ϲ�ȣ', 'company_number', '7',	'ssn1');
				break;
			case '3' :
				FormCheck.setCheck(tempFrom, 'ssn1',	'y', '���ǹ�ȣ', 'num+eng',	'9');
				FormCheck.setCheck(tempFrom, 'ssn2',	'y', '���ǹ�ȣ', 'passport_number', '0',	'ssn1');
				break;
			case '4' :
				FormCheck.setCheck(tempFrom, 'ssn1',	'y', '�ܱ��ε�Ϲ�ȣ', 'num',	'');
				FormCheck.setCheck(tempFrom, 'ssn2',	'y', '�ܱ��ε�Ϲ�ȣ', 'foreigner_number', '',	'ssn1');
				break;
            default:
                FormCheck.setCheck(tempFrom, 'ssn1',	'n');
				FormCheck.setCheck(tempFrom, 'ssn2',	'n');
                break;
		}
	} else {
	    FormCheck.setCheck(tempFrom, 'ssn1',	'y', '�ֹε�Ϲ�ȣ', 'num',	'');
		FormCheck.setCheck(tempFrom, 'ssn2',	'y', '�ֹε�Ϲ�ȣ', 'personal_number', '',	'ssn1');
	}

	var	namecheckCount = Ajax.rltXmlOnce(rsXml,	"namecheckCount");

	if(typeof(document.getElementsByName('com_reg_no1')[0]) ==	'object') {

		var	regno1 = document.getElementsByName('com_reg_no1')[0];
		var	regno2 = document.getElementsByName('com_reg_no2')[0];
		var	regno3 = document.getElementsByName('com_reg_no3')[0];

		if(regno1.value != '' || regno2.value != '' || regno3.value != '') {
			var regno = regno1.value +'-'+ regno2.value +'-'+ regno3.value;
			var robj = check_com_reg_no(regno);
			if(robj == false) {
				regno1.value = '';
				regno2.value = '';
				regno3.value = '';
				alert('����� ��Ϲ�ȣ�� ��Ȯ�ϱ� �ʽ��ϴ�. �ٽ� Ȯ���� �ּ���.');
				regno1.focus();
				return false;
			}

		}
	}

	var	jsCheck	=	FormCheck.init(tempFrom);

	if(jsCheck == true)	{
		if(mform.passwd.value != mform.passwd_chk.value) {
			alert('��й�ȣ�� ��ġ���� �ʽ��ϴ�.');
			mform.passwd_chk.focus();
			return false;
		}

		if(namecheckCount >	0) {
			if(mform.ssn_namecheck.value ==	'')	{
				alert('�Ǹ������� ���ּ���.');
				return false;
			}
		}

	} else {
		return false;
	}

    try {
        if(document.getElementById("isJunior").value != 'T') {
            alert('�����븮�� ������������ �Ͻñ� �ٶ��ϴ�.');
            return false;
        }
    } catch(e) {}

    return true;
}

/*
*	[��ɰ���,2009-12-30,Jeong Yong Hun]
*	��й�ȣ ��ȿ�� üũ
*	���� :
	1. �ּ� 8�ڸ� �̻�, 16�ڸ� �̸�
	2. Ư�������� pgsql���� ���� ���ϴ� Ư�����ڴ� �����ϰ�, &, %, $, *, ', ", :, ; � ��� �Ұ���. (������ �ص����� ������ �Ұ���)
	3. ��й�ȣ�� ù�ڸ��� �ݵ�� ���� (����, Ư������ �Ұ�)
	4. �Ұ����� ���� �Է½� ������ ���� �޼��� ǥ��
	- ��й�ȣ�� 8�ڸ� �̻� 16�ڸ� �����Դϴ�.
	- ��й�ȣ�� �����ڷ� �����ؾ� �մϴ�.
	- ����� �� ���� Ư������(*)�Դϴ�.
	5. ������ ������� ����ϴ� ����� �������, ���� �����ϰų� �����Ҷ��� ����.
	6. ȸ������, �������(����������) � ����
*/
// ��������� ����� Ȥ�� �űԻ���� ���Խ� ����� ��й�ȣ ��ȿ�� üũ.
// ____________________________________________________________________________
function check_password_js_validate(passwd)
{
	if(validationPasswordSubmit(passwd) == false){
        return false;
    }
	return true;
}

/**
 * ��й�ȣ ���ռ� üũ
 */
function validationPasswordSubmit(passwd)
{
    if(!passwd){
    	alert("��й�ȣ�� �Է����ּ���.");
        return false;
    }

    if(passwd.length < 8 || passwd.length > 16){
        alert("��й�ȣ�� 8�ں��� 16�ڱ��� �����մϴ�.");
        return false;
    }

    if(checkInitialCharacterIsEnglish(passwd) == false){
        alert("��й�ȣ�� �����ڷ� �����ؾ� �մϴ�.");
        return false;
    }
    
    var oRegexp = /[`"?;|=&%#]/;
	if(oRegexp.test(passwd)){
		alert("��й�ȣ�� ����� �� ���� ���ڸ� �Է��Ͽ����ϴ�.");
		return false;
	}

    if(checkPasswordMixture(passwd) == false){
        alert("��й�ȣ�� ����/����/Ư������ �������� 8�ڸ�~16�ڸ��Դϴ�.");
        return false;
    }

    if(checkPasswordStreak(passwd) == 3){
        alert("��й�ȣ�� 4���̻� ���ӵ� ���ڸ� ����� �� �����ϴ�.");
        return false;
    }

    if(checkPasswordStreak(passwd) == 2){
        alert("��й�ȣ�� ���Ϲ��ڸ� 3���̻� �ݺ����� ����� �� �����ϴ�.");
        return false;
    }

    return true;
}


/**
 * ù���� ���� Ȯ��
 */
function checkInitialCharacterIsEnglish(passwd)
{
   var initialChar = passwd.split('',1);
   var eng_pattern = /^[a-z]+$/i;
   var checkPatternResult = eng_pattern.test(initialChar);
   if(!checkPatternResult) {
	 return false;
   }
   return true;
}

/**
 * ��й�ȣ ���� ���� Ư������ ���� Ȯ��
 */
function checkPasswordMixture(passwd)
{
	var chk_num = passwd.search(/[0-9]/g);
    var chk_eng = passwd.search(/[a-zA-Z]/ig);
    var chk_spc = passwd.search(/[\'\~\!\@\^\*\(\)\-\_\+\[\]\{\}\\\\:\,\.\<\>\/]/);

    if(chk_num < 0 || chk_eng < 0 || chk_spc < 0){
    	return false;
    }
    return true;
}

/**
 * ��й�ȣ ���Ӽ� Ȯ��
 */
function checkPasswordStreak(passwd)
{
	var cnt2=1,cnt3=1;

	for(i=0;i < passwd.length;i++){
        tempw1 = passwd.charAt(i);
        next_pass = (parseInt(tempw1.charCodeAt(0)))+1;
        temp_p = passwd.charAt(i+1);
        tempw2 = (parseInt(temp_p.charCodeAt(0)));

        if (tempw2 == next_pass) cnt2 = cnt2 + 1;
        else cnt2 = 1;

        if (tempw1 == temp_p) cnt3 = cnt3 + 1;
        else cnt3 = 1;

        if (cnt2 > 3){
            return 3;
        }

        if (cnt3 > 2){
            return 2;
        }
    }
}

function check_com_reg_no(no){
	var objstring = no;
	var li_temp, li_lastid;
	var biz_value = Array();

	biz_value[0] = ( parseFloat(objstring.substring(0 ,1)) * 1 ) % 10;
	biz_value[1] = ( parseFloat(objstring.substring(1 ,2)) * 3 ) % 10;
	biz_value[2] = ( parseFloat(objstring.substring(2 ,3)) * 7 ) % 10;
	biz_value[3] = ( parseFloat(objstring.substring(4 ,5)) * 1 ) % 10;
	biz_value[4] = ( parseFloat(objstring.substring(5 ,6)) * 3 ) % 10;
	biz_value[5] = ( parseFloat(objstring.substring(7 ,8)) * 7 ) % 10;
	biz_value[6] = ( parseFloat(objstring.substring(8 ,9)) * 1 ) % 10;
	biz_value[7] = ( parseFloat(objstring.substring(9,10)) * 3 ) % 10;
	li_temp = parseFloat(objstring.substring(10,11)) * 5 + "0";
	biz_value[8] = parseFloat(li_temp.substring(0,1)) + parseFloat(li_temp.substring(1,2));
	biz_value[9] = parseFloat(objstring.substring(11,12));
	li_lastid = (10 - ( ( biz_value[0] + biz_value[1] + biz_value[2] + biz_value[3] + biz_value[4] + biz_value[5] + biz_value[6] + biz_value[7] + biz_value[8] ) % 10 ) ) % 10;

	if (biz_value[9] != li_lastid) {
		return false;
	}
	else
		return true;
}


// ȸ������	���� ��	üũ
function com_member_modifyformCheck()
{
	var	tempFrom	 =	"com_member_modify";

	realMemberCheck(tempFrom);

//[CS,2009-12-30,Jeong Yong Hun] -��й�ȣ ��ȿ�� ó��
	var passwd = document.com_member_modify.passwd.value;
    if(passwd != '') {
	    var checkResult = check_password_js_validate(passwd);
        if(checkResult) {
            if(passwd != document.com_member_modify.passwd_chk.value) {
                alert('��й�ȣ�� ��ġ���� �ʽ��ϴ�.');
                document.com_member_modify.passwd_chk.focus();
                return false;
            }
        }

    } else {
        var checkResult = true;
    }
	if(checkResult == false) return false;

	if(typeof(document.getElementsByName('com_reg_no1')[0]) ==	'object') {

		var	regno1 = document.getElementsByName('com_reg_no1')[0];
		var	regno2 = document.getElementsByName('com_reg_no2')[0];
		var	regno3 = document.getElementsByName('com_reg_no3')[0];

		if(regno1.value != '' || regno2.value != '' || regno3.value != '') {
			var regno = regno1.value +'-'+ regno2.value +'-'+ regno3.value;
			var robj = check_com_reg_no(regno);

			if(robj == false) {
				regno1.value = '';
				regno2.value = '';
				regno3.value = '';
				alert('����� ��Ϲ�ȣ�� ��Ȯ�ϱ� �ʽ��ϴ�. �ٽ� Ȯ���� �ּ���.');
				regno1.focus();
				return false;
			}

		}
	}

	var	jsCheck	=	FormCheck.init(tempFrom);

	if(jsCheck == true)	{
		return true;
	} else {
		return false;
	}
}

//���� üũ����
function realMemberCheck(formName)
{
	call_member_ajax();
	var	rsXml	=	Ajax.rltXml();
	var	xmlData	=	Ajax.rltXmlLoop(rsXml, "member_title");
	var	tempArr	=	new	Array();

	for(var	i =	0; i < xmlData.length; i++)	{
		tempArr[i]	=	new	Array();
		tempArr[i]["code"]	=	Ajax.rltXmlOnce(xmlData[i],	"code");
		tempArr[i]["name"]	=	Ajax.rltXmlOnce(xmlData[i],	"name");
		tempArr[i]["attribute"]	=	Ajax.rltXmlOnce(xmlData[i],	"attribute");
		tempArr[i]["necessary"]	=	Ajax.rltXmlOnce(xmlData[i],	"necessary");
		tempArr[i]["attribute_len"]	=	Ajax.rltXmlOnce(xmlData[i],	"attribute_len");
		tempArr[i]["attribute_use"]	=	Ajax.rltXmlOnce(xmlData[i],	"attribute_use");

        if(tempArr[i]["necessary"] == "Y") {

            if(tempArr[i]["attribute"] == "file") {
                var tempName = tempArr[i]["code"]+"_img";

                if(document.getElementById(tempName) != null && document.getElementById(tempName) != "undefined"){
                    if(document.getElementById(tempName).href != ""){
                        continue;
                    }
                }
            }

			switch (tempArr[i]["attribute"]) {
				case	"text"	:	//�Ϲ��ؽ�Ʈ
					if(tempArr[i]["code"] == "m_id") {
						FormCheck.setCheck(formName, tempArr[i]["code"], 'y', tempArr[i]["name"], 'num+eng', '4-'+tempArr[i]["attribute_len"]);
					} else if(tempArr[i]["code"] ==	"nickname")	{
						FormCheck.setCheck(formName, tempArr[i]["code"], 'y', tempArr[i]["name"], '', '2-'+tempArr[i]["attribute_len"]);
					} else {
						FormCheck.setCheck(formName, tempArr[i]["code"], 'y', tempArr[i]["name"], '', '1-'+tempArr[i]["attribute_len"]);
					}
					break;
				case	"password"	:	//��й�ȣ
					FormCheck.setCheck(formName, tempArr[i]["code"], 'y', tempArr[i]["name"], '', '1-'+tempArr[i]["attribute_len"]);
					FormCheck.setCheck(formName, tempArr[i]["code"]+'_chk',	'y', tempArr[i]["name"], '', '1-'+tempArr[i]["attribute_len"]);
					break;
				case	"file"	:	//����÷��
				case	"url"	:	//url
				case	"selectbox"	:	//����Ʈ�ڽ�
				case	"textarea"	:	//�ؽ�Ʈ�ڽ�
					FormCheck.setCheck(formName, tempArr[i]["code"], 'y', tempArr[i]["name"], '');
					break;
				case	"juminno"	:
					FormCheck.setCheck(formName, tempArr[i]["code"]+'1', 'y', tempArr[i]["name"], 'num+eng', '2-9');
					FormCheck.setCheck(formName, tempArr[i]["code"]+'2', 'y', tempArr[i]["name"], 'jumin_number', '0-7', tempArr[i]["code"]+'1');
					break;
				case	"comregno"	: //����ڵ�Ϲ�ȣ
					FormCheck.setCheck(formName, tempArr[i]["code"]+'1', 'y', tempArr[i]["name"], 'num', '3-3');
					FormCheck.setCheck(formName, tempArr[i]["code"]+'2', 'y', tempArr[i]["name"], 'num', '2-2');
					FormCheck.setCheck(formName, tempArr[i]["code"]+'3', 'y', tempArr[i]["name"], 'num', '5-5',	tempArr[i]["code"]+'1');
					break;
				case	"date"	:	//��¥
					FormCheck.setCheck(formName, tempArr[i]["code"]+'Y', 'y', tempArr[i]["name"], '');
					FormCheck.setCheck(formName, tempArr[i]["code"]+'M', 'y', tempArr[i]["name"], '');
					FormCheck.setCheck(formName, tempArr[i]["code"]+'D', 'y', tempArr[i]["name"], '');
					break;
				case	"email"	:	//�̸���
					FormCheck.setCheck(formName, tempArr[i]["code"]+'1', 'y', tempArr[i]["name"], '');
					FormCheck.setCheck(formName, tempArr[i]["code"]+'3', 'y', tempArr[i]["name"], '');
					break;
				case	"checkbox"	 :	//üũ�ڽ�
					FormCheck.setCheck(formName, tempArr[i]["code"], 'y', tempArr[i]["name"], 'checkbox', '', '', '1');
					break;
				case	"radio"	:	//����
					FormCheck.setCheck(formName, tempArr[i]["code"], 'y', tempArr[i]["name"], 'checkbox', '', '', '');
					break;
				case	"address"	:	//�ּ�
					if(tempArr[i]["attribute_use"] == "Y") {
                        FormCheck.setCheck(formName, tempArr[i]["code"]+'_post1', 'y', tempArr[i]["name"], 'num', '5-5');
						//FormCheck.setCheck(formName, tempArr[i]["code"]+'_post1', 'y', tempArr[i]["name"], 'num', '3-3');
						//FormCheck.setCheck(formName, tempArr[i]["code"]+'_post2', 'y', tempArr[i]["name"], 'num', '3-3');
					}
					FormCheck.setCheck(formName, tempArr[i]["code"], 'y', tempArr[i]["name"], '');
					break;
				case	"tel"	:	//��ȭ��ȣ
					if(tempArr[i]["code"] == "mobile_no") {
						FormCheck.setCheck(formName, tempArr[i]["code"]+'1', 'y', tempArr[i]["name"]+'1', '');
						FormCheck.setCheck(formName, tempArr[i]["code"]+'2', 'y', tempArr[i]["name"]+'2', 'num', '1-4');
						FormCheck.setCheck(formName, tempArr[i]["code"]+'3', 'y', tempArr[i]["name"]+'3', 'num', '1-4');
					} else {
						if(tempArr[i]["attribute_use"] == "Y") {
							FormCheck.setCheck(formName, tempArr[i]["code"], 'y', tempArr[i]["name"]+'0', 'num', '1-4');
						}
						FormCheck.setCheck(formName, tempArr[i]["code"]+'1', 'y', tempArr[i]["name"]+'1', 'num', '1-4');
						FormCheck.setCheck(formName, tempArr[i]["code"]+'2', 'y', tempArr[i]["name"]+'2', 'num', '1-4');
						FormCheck.setCheck(formName, tempArr[i]["code"]+'3', 'y', tempArr[i]["name"]+'3', 'num', '1-4');
					}
					break;
			}
		}
	}
}

// ���Կ���	��üũ(�ֹε�Ϲ�ȣ)
function com_member_confirmCheck()
{
	call_member_ajax();

	var	mform	=	"com_member";
	var	rsXml	=	Ajax.rltXml();
	var	email_necessary	=	Ajax.rltXmlOnce(rsXml, "email_necessary");

	FormCheck.setCheck(mform, 'com_member_name', 'y', '�̸�', '');

	if(email_necessary ==	"Y") {
		FormCheck.setCheck(mform, 'com_member_email', 'y', '�̸���', 'email');
	} else {
		FormCheck.setCheck(mform, 'com_member_ssn1', 'y', '�ֹε�Ϲ�ȣ', 'num', '6-6');
	    FormCheck.setCheck(mform, 'com_member_ssn2', 'y', '�ֹε�Ϲ�ȣ', 'personal_number', '7-7', 'com_member_ssn1');
        FormCheck.setCheck(mform, 'com_member_person_uniq_check', 'y', '�����ĺ�����', 'checkbox', '', '', '');
    }
    return FormCheck.init(mform);

}


// ���Կ���	����(�ֹε�Ϲ�ȣ)
function com_member_confirm_submit()
{
	var	TEMPLATE_NAME =	get_template();

	if(com_member_confirmCheck() ==	false) return false;
	else {
		window.open('/chtml/member.php?template='+TEMPLATE_NAME, document.com_member.target, 'width=430,height=354,scrollbars=no');
		
		SSL.send({
            'formName':'com_member'
            ,'elementName':['com_member_name','com_member_email']
            ,'postName':'encrypted_str'
        });
        return false;
	}
}

// ���Կ���	��üũ(��� ��Ϲ�ȣ��, �ֹε�Ϲ�ȣ, �ܱ��ε�Ϲ�ȣ, ���ǹ�ȣ, ���ι�ȣ)
// Param : int type(1:�ֹε�Ϲ�ȣ, 2:�ܱ��ε�Ϲ�ȣ, 3:���ǹ�ȣ, 4:���ι�ȣ)
function com_member_confirmCheck_All(type) {
	var	mform	= "com_member";

	switch(type) {
		case 1 :    // �ֹε�Ϲ�ȣ
		    document.getElementsByName('com_member_name_2')[0].value = '';
			document.getElementsByName('com_member_ssn1_2')[0].value = '';
			document.getElementsByName('com_member_ssn2_2')[0].value = '';
			document.getElementsByName('com_member_name_3')[0].value = '';
			document.getElementsByName('com_member_ssn1_3_1')[0].value = '';
			document.getElementsByName('com_member_ssn1_3_2')[0].value = '';
			document.getElementsByName('com_member_ssn2_3_1')[0].value = '';
			document.getElementsByName('com_member_ssn2_3_2')[0].value = '';
            FormCheck.setCheck(mform, 'com_member_ssn1_1', 'y', '�ֹε�Ϲ�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_1', 'y', '�ֹε�Ϲ�ȣ', 'num', '7-7');
			FormCheck.setCheck(mform, 'com_member_ssn1_2', 'n', '���ι�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_2', 'n', '���ι�ȣ', 'num', '7-7');
			FormCheck.setCheck(mform, 'com_member_ssn1_3_1', 'n', '���ǹ�ȣ', 'eng+num', '9');
			FormCheck.setCheck(mform, 'com_member_ssn1_3_2', 'n', '�ܱ��ε�Ϲ�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_3_2', 'n', '�ܱ��ε�Ϲ�ȣ', 'num', '7-7');
            FormCheck.setCheck(mform, 'com_member_ssn2_1', 'y', '�ֹε�Ϲ�ȣ', 'personal_number', '7-7', 'com_member_ssn1_1');

			break;

		case 2 :    // ���� ��Ϲ�ȣ
			document.getElementsByName('com_member_name_1')[0].value = '';
			document.getElementsByName('com_member_ssn1_1')[0].value = '';
			document.getElementsByName('com_member_ssn2_1')[0].value = '';
			document.getElementsByName('com_member_name_3')[0].value = '';
			document.getElementsByName('com_member_ssn1_3_1')[0].value = '';
			document.getElementsByName('com_member_ssn1_3_2')[0].value = '';
			document.getElementsByName('com_member_ssn2_3_1')[0].value = '';
			document.getElementsByName('com_member_ssn2_3_2')[0].value = '';
			FormCheck.setCheck(mform, 'com_member_ssn1_2', 'y', '���ι�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_2', 'y', '���ι�ȣ', 'num', '7-7');
			FormCheck.setCheck(mform, 'com_member_ssn1_1', 'n', '�ֹε�Ϲ�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_1', 'n', '�ֹε�Ϲ�ȣ', 'num', '7-7');
			FormCheck.setCheck(mform, 'com_member_ssn1_3_1', 'n', '���ǹ�ȣ', 'eng+num', '9');
			FormCheck.setCheck(mform, 'com_member_ssn1_3_2', 'n', '�ܱ��ε�Ϲ�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_3_2', 'n', '�ܱ��ε�Ϲ�ȣ', 'num', '7-7');
			FormCheck.setCheck(mform, 'com_member_ssn2_2', 'y', '���ε�Ϲ�ȣ', 'company_number', '7-7', 'com_member_ssn1_2');
			break;


		case 3 :    // ���ǹ�ȣ
			document.getElementsByName('com_member_name_1')[0].value = '';
			document.getElementsByName('com_member_ssn1_1')[0].value = '';
			document.getElementsByName('com_member_ssn2_1')[0].value = '';
			document.getElementsByName('com_member_name_2')[0].value = '';
			document.getElementsByName('com_member_ssn1_2')[0].value = '';
			document.getElementsByName('com_member_ssn2_2')[0].value = '';
			document.getElementsByName('com_member_ssn2_3_1')[0].value = '';
			document.getElementsByName('com_member_ssn2_3_2')[0].value = '';
			FormCheck.setCheck(mform, 'com_member_ssn1_3_1', 'y', '���ǹ�ȣ', 'eng+num', '9');
			FormCheck.setCheck(mform, 'com_member_ssn1_1', 'n', '�ֹε�Ϲ�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_1', 'n', '�ֹε�Ϲ�ȣ', 'num', '7-7');
			FormCheck.setCheck(mform, 'com_member_ssn1_2', 'n', '���ι�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_2', 'n', '���ι�ȣ', 'num', '7-7');
			FormCheck.setCheck(mform, 'com_member_ssn1_3_2', 'n', '�ܱ��ε�Ϲ�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_3_2', 'n', '�ܱ��ε�Ϲ�ȣ', 'num', '7-7');
			FormCheck.setCheck(mform, 'com_member_ssn1_3_2', 'y', '���ǹ�ȣ', 'passport_number', '9', 'com_member_ssn1_3_1');

			break;

		case 4 :    // �ܱ��ε�Ϲ�ȣ
			document.getElementsByName('com_member_name_1')[0].value = '';
			document.getElementsByName('com_member_ssn1_1')[0].value = '';
			document.getElementsByName('com_member_ssn2_1')[0].value = '';
			document.getElementsByName('com_member_name_2')[0].value = '';
			document.getElementsByName('com_member_ssn1_2')[0].value = '';
			document.getElementsByName('com_member_ssn2_2')[0].value = '';
			document.getElementsByName('com_member_ssn1_3_1')[0].value = '';

			FormCheck.setCheck(mform, 'com_member_ssn1_3_2', 'y', '�ܱ��ε�Ϲ�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_3_2', 'y', '�ܱ��ε�Ϲ�ȣ', 'num', '7-7');
	        FormCheck.setCheck(mform, 'com_member_ssn1_1', 'n', '�ֹε�Ϲ�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_1', 'n', '�ֹε�Ϲ�ȣ', 'num', '7-7');
			FormCheck.setCheck(mform, 'com_member_ssn1_2', 'n', '���ι�ȣ', 'num', '6-6');
			FormCheck.setCheck(mform, 'com_member_ssn2_2', 'n', '���ι�ȣ', 'num', '7-7');
			FormCheck.setCheck(mform, 'com_member_ssn1_3_1', 'n', '���ǹ�ȣ', 'eng+num', '9');
			FormCheck.setCheck(mform, 'com_member_ssn2_3_2', 'y', '�ܱ��ε�Ϲ�ȣ', 'foreigner_number', '7', 'com_member_ssn1_3_2');
			break;
	}

	return FormCheck.init(mform);
}

// ���Կ���	����(��� ��Ϲ�ȣ��, �ֹε�Ϲ�ȣ, �ܱ��ε�Ϲ�ȣ, ���ǹ�ȣ, ���ι�ȣ)
function com_member_confirm_submit_All(){
    var member_type = document.getElementsByName('member_type');		//	�з� : 1. ����, 2. ����, 3. �ܱ���
	var member_type03 = document.getElementsByName('member_type03');	//	�ܱ��� : 1. ����, 2. �ܱ��ε�Ϲ�ȣ

	var type = 1;			// ����ڰ� ������ ��Ϲ�ȣ  1:�ֹε�Ϲ�ȣ, 2:���ι�ȣ, 3:���ǹ�ȣ, 4:�ܱ��ε�Ϲ�ȣ

	var rtnType = 1;
	var rtnType03 = 1;

	for(var i=0; i<member_type.length; i++) {
		if(member_type[i].checked == true) {
			rtnType = member_type[i].value;
			break;
		}
	}

	for(var i=0; i<member_type03.length; i++) {
		if(member_type03[i].checked == true) {
			rtnType03 = member_type03[i].value;
			break;
		}
	}

	if(document.getElementsByName("com_member_name_" + rtnType)[0].value == '') {
		document.getElementsByName("com_member_name_" + rtnType)[0].focus();
		alert("�̸��� �Է��Ͽ� �ֽñ� �ٶ��ϴ�.");
		return false;
	}

	if(rtnType=="3") {
        if(document.getElementsByName("com_member_ssn1_" + rtnType + "_" + rtnType03)[0].value == '') {
            document.getElementsByName("com_member_ssn1_" + rtnType + "_" + rtnType03)[0].focus();
            alert("��Ϲ�ȣ�� �Է��Ͽ� �ֽñ� �ٶ��ϴ�.");
            return false;
        }

        if(rtnType03 == "2") {
            if(document.getElementsByName("com_member_ssn2_" + rtnType + "_" + rtnType03)[0].value == '') {
                document.getElementsByName("com_member_ssn2_" + rtnType + "_" + rtnType03)[0].focus();
                alert("��Ϲ�ȣ�� �Է��Ͽ� �ֽñ� �ٶ��ϴ�.");
                return false;
            }
        }

		document.getElementsByName('com_member_name')[0].value = document.getElementsByName('com_member_name_' + rtnType)[0].value;
		document.getElementsByName('com_member_ssn1')[0].value = document.getElementsByName('com_member_ssn1_' + rtnType + '_' + rtnType03)[0].value;
		document.getElementsByName('com_member_ssn2')[0].value = document.getElementsByName('com_member_ssn2_' + rtnType + '_' + rtnType03)[0].value;
	} else {
        if(document.getElementsByName("com_member_ssn1_" + rtnType)[0].value == '') {
            document.getElementsByName("com_member_ssn1_" + rtnType)[0].focus();
            alert("��Ϲ�ȣ�� �Է��Ͽ� �ֽñ� �ٶ��ϴ�.");
            return false;
        }

        if(document.getElementsByName("com_member_ssn2_" + rtnType)[0].value == '') {
            document.getElementsByName("com_member_ssn2_" + rtnType)[0].focus();
            alert("��Ϲ�ȣ�� �Է��Ͽ� �ֽñ� �ٶ��ϴ�.");
            return false;
        }

		document.getElementsByName('com_member_name')[0].value = document.getElementsByName('com_member_name_' + rtnType)[0].value;
		document.getElementsByName('com_member_ssn1')[0].value = document.getElementsByName('com_member_ssn1_' + rtnType)[0].value;
		document.getElementsByName('com_member_ssn2')[0].value = document.getElementsByName('com_member_ssn2_' + rtnType)[0].value;
	}

	if(rtnType==1) {
		type = 1;
	} else if(rtnType==2) {
		type = 2;
	} else if(rtnType==3 && rtnType03==1) {
		type = 3;
	} else if(rtnType==3 && rtnType03==2) {
		type = 4;
	} else {
		alert('ȸ�� �з� ������ �ùٸ��� �ʽ��ϴ�.');
		return false;
	}

	var	TEMPLATE_NAME =	get_template();

    if(com_member_confirmCheck_All(type) ==	true) {
	    window.open('/chtml/member.php?template='+TEMPLATE_NAME, document.com_member.target, 'width=430,height=354,scrollbars=no');
        return true;
    } else{
        return false;

    }

}

// ���	���� ��üũ
function com_member_agreementCheck()
{
	return com_member_agreementNewCheck();
}

// ���	���� ��üũ - �űԹ���
function com_member_agreementNewCheck()
{
    try {
        if(document.getElementsByName('com_member_check_agree')[0].checked == false) {
            alert('�̿����� �����ϼž� ȸ������ �����Ͻ� �� �ֽ��ϴ�.');
            return false;
        }
    } catch(e) {}
    try {
        if(document.getElementsByName('com_member_check_safe')[0].checked == false) {
            alert('����������޹�ħ�� �����ϼž� ȸ������ �����Ͻ� �� �ֽ��ϴ�.');
            return false;
        }
    } catch(e) {}
    try {
        if(document.getElementsByName('com_member_check_collection')[0].checked == false) {
            alert('���������� ���� �� �̿������ �����ϼž� ȸ������ �����Ͻ� �� �ֽ��ϴ�.');
            return false;
        }
    } catch(e) {}

}

// ������ȣ�˻�
function com_member_zipcode(name1, name2, name3 ,tpl)
{
	tpl =  get_template();
	window.open("/chtml/zipcode.php?template="+tpl+"&com_zipcode_openerform=document.com_member&com_zipcode_openername1=document.com_member."	+ name1	+ "&com_zipcode_openername2=document.com_member."	+ name2	+ "&com_zipcode_openername3=document.com_member." +	name3, "cafe_component_zipcode", "width=447,height=370,scrollbars=yes");
}

// ������ȣ�˻�	����
function com_member_zipcode2(name1,	name2, name3 , tpl)
{
	tpl =  get_template();
	window.open("/chtml/zipcode.php?template="+tpl+"&com_zipcode_openerform=document.com_member_modify&com_zipcode_openername1=document.com_member_modify." +	name1 +	"&com_zipcode_openername2=document.com_member_modify." + name2 + "&com_zipcode_openername3=document.com_member_modify."	+ name3, "cafe_component_zipcode", "width=447,height=370,scrollbars=yes");
}

// ������ȣ�˻�	(ȸ������ �̿��� ��)
function etc_zipcode(form_name,	form_zip, form_addr)
{
	var	TEMPLATE_NAME =	get_template();
	window.open("/chtml/zipcode.php?template="+TEMPLATE_NAME+"&com_zipcode_openerform="+form_name+"&com_zipcode_openername1=" +	form_zip + "&com_zipcode_openername2="+	form_zip +"&com_zipcode_openername3=" +	form_addr, "cafe_component_zipcode", "width=447,height=370,scrollbars=yes");
}

// ������ȣ�˻�	���� (ȸ������ �̿��� ��)
function etc_zipcode_mod(form_name,	form_zip, form_addr)
{
	var	TEMPLATE_NAME =	get_template();
	window.open("/chtml/zipcode.php?template="+TEMPLATE_NAME+"&com_zipcode_openerform="+form_name+"&com_zipcode_openername1=" +	form_zip + "&com_zipcode_openername2="+	form_zip +"&com_zipcode_openername3=" +	form_addr, "cafe_component_zipcode", "width=447,height=370,scrollbars=yes");
}

// ���̵��ߺ�Ȯ��
function com_member_idCheck(tpl)
{
	window.open("/chtml/member.php?com_member_basic=idcheck_form&template="+tpl, "com_member_idcheck", "width=430,height=354,scrollbars=no");
}

// ���̵��ߺ�Ȯ�� ��üũ
function com_member_id_formCheck()
{
	var	mform =	"com_member_idcheck";

	FormCheck.setCheck(mform, 'com_member_check_id', 'y', '���̵�',	'num+eng', '4-16');
	if(FormCheck.init(mform)) {
        SSL.send({
            'formName':'com_member_idcheck'
            ,'elementName':['com_member_check_id']
            ,'postName':'encrypted_str'
        });
        return false;
    } else {
        return false;
    }
}

// �����ߺ�Ȯ��
function com_member_nicknameCheck(tpl)
{

	window.open("/chtml/member.php?com_member_basic=nicknamecheck_form&template="+tpl+"&formname=com_member",	"com_member_idcheck", "width=430,height=354,scrollbars=no");
}

// �����ߺ�Ȯ��	��üũ
function com_member_nickname_formCheck()
{
	var	mform =	"com_member_nicknamecheck";

	FormCheck.setCheck(mform, 'com_member_check_nickname', 'y',	'����',	'',	'2-16');
	return FormCheck.init(mform);
}

// ����������������	�����ߺ�Ȯ��
function com_member_modify_nicknameCheck()
{
	var	TEMPLATE_NAME =	get_template();
	window.open("/chtml/member.php?com_member_basic=nicknamecheck_form&template="+TEMPLATE_NAME+"&formname=com_member_modify", "com_member_idcheck", "width=430,height=354,scrollbars=no");
}

// �̸��� ����
function com_member_email_sel(obj1,	obj2)
{
	var	mselect	= obj1.selectedIndex;

	if(obj1.options[mselect] !=	'')	{
		obj2.value = obj1.options[mselect].value;
	}
}

// ��Ϲ�ȣ ���� ����
function com_member_juminno_sel(code, type) {
	var ssn_type = document.getElementsByName(code + '_type');

	if(type=="31" || type=="32")	type = "3";

	for(var i=0; i<ssn_type.length; i++) {
		if(ssn_type[i].value == type) {
			ssn_type[i].checked = true;
			break;
		}
	}
}

// ��Ϲ�ȣ ���� ����2
function com_member_juminno_sel2(code) {
	var ssn_type = document.getElementsByName(code + '_type');
	var type = "1";

	for(var i=0; i<ssn_type.length; i++) {
		if(ssn_type[i].checked == true) {
			type = ssn_type[i].value;
			break;
		}
	}

	document.getElementById(code + '1').value = "";
	document.getElementById(code + '2').value = "";

    document.getElementById(code + '1').style.display="";
    document.getElementById(code + '2').style.display="";
    document.getElementById(code + '_blank').style.display="";

    if(type=="0") {
        document.getElementById(code + '1').style.display="none";
        document.getElementById(code + '2').style.display="none";
        document.getElementById(code + '_blank').style.display="none";
	} else if(type=="3"){
		document.getElementById(code + '1').setAttribute('size', 13);
		document.getElementById(code + '1').maxLength = 9;
		document.getElementById(code + '_blank').style.display="none";
		document.getElementById(code + '2').style.display="none";
	} else {
		document.getElementById(code + '1').setAttribute('size', 7);
		document.getElementById(code + '1').maxLength = 6;
		document.getElementById(code + '_blank').style.display="";
		document.getElementById(code + '2').style.display="";
	}
}

// ȸ���α��� �� üũ
function com_member_loginformCheck()
{
	var	mform =	"com_member_login";

	FormCheck.setCheck(mform, 'com_member_login_id', 'y', '���̵�',	'num+eng', '4-16');
	FormCheck.setCheck(mform, 'com_member_login_pw', 'y', '��й�ȣ', '', '');
	return FormCheck.init(mform);
}

// ȸ���α���
function com_member_login_submit()
{
	var	form = document.com_member_login;
	if(com_member_loginformCheck() == false) return	false;
	else {
		if(form.action == '/chtml/member.php') form.action = self.location.pathname;
		form.target	= '';
        /*
		if(typeof(gRelay) != "undefined")
		{
			gRelay.relayForm(form);
		}
		form.submit();
		return true;
        */
        SSL.send({
            'formName':'com_member_login'
            ,'elementName':['com_member_login_id','com_member_login_pw']
            ,'postName':'encrypted_str'
        });
        return false;
	}
}

function get_template()
{
	var template = "bizdemo40260";
	if(template == "")
	{
		call_member_ajax();
		var	rsXml  = Ajax.rltXml();
		template   = Ajax.rltXmlOnce(rsXml, "TEMPLATE_NAME");
	}
	return template;
}

// ���̵� ã��
function com_member_find_id()
{
	var	TEMPLATE_NAME="";
	TEMPLATE_NAME = get_template();
	window.open('/chtml/member.php?com_member_basic=find_id_form&template='+TEMPLATE_NAME, 'component_member_fd', 'width=430,height=354,scrollbars=no');
}

// ���̵�ã�� �� üũ
function com_member_findidformCheck()
{
	call_member_ajax();

	var	mform	=	"com_member_findid";
	var	rsXml	=	Ajax.rltXml();
	var	email_necessary	= Ajax.rltXmlOnce(rsXml, "email_necessary");

	FormCheck.setCheck(mform, 'com_member_findid_name',	'y', '�̸�', '');

	if(email_necessary == "Y") {
		FormCheck.setCheck(mform, 'com_member_findid_email', 'y', '�̸����ּ�',	'email');
	} else {
		var mType = "1";
		for(i=0; i<document.getElementsByName('member_type').length; i++) {
			if(document.getElementsByName('member_type')[i].checked == true) {
				mType = document.getElementsByName('member_type')[i].value;
				break;
			}
		}

		if(mType == 1) {
			FormCheck.setCheck(mform, 'com_member_findid_ssn1',	'y', '��Ϲ�ȣ', 'num',	'6');
			FormCheck.setCheck(mform, 'com_member_findid_ssn2',	'y', '��Ϲ�ȣ', 'jumin_number', '7',	'com_member_findid_ssn1');
		} else {
			FormCheck.setCheck(mform, 'com_member_findid_ssn1',	'y', '��Ϲ�ȣ', 'num+eng',	'9');
			FormCheck.setCheck(mform, 'com_member_findid_ssn2',	'n', '��Ϲ�ȣ', 'jumin_number', '7',	'com_member_findid_ssn1');
		}
	}

    if(FormCheck.init(mform)) {
        SSL.send({
            'formName':'com_member_findid'
            ,'elementName':['com_member_findid_name','com_member_findid_email','com_member_findid_ssn1','com_member_findid_ssn2']
            ,'postName':'encrypted_str'
        });
        return false;
    } else {
        return false;
    }

	//return FormCheck.init(mform);
}

// ��й�ȣ	ã��
function com_member_find_pw()
{
	var	TEMPLATE_NAME="";
	TEMPLATE_NAME = get_template();
	window.open('/chtml/member.php?com_member_basic=find_pw_form&template='+TEMPLATE_NAME, 'component_member_fw', 'width=430,height=354,scrollbars=no');
}

// ��й�ȣ	1�ܰ� �� üũ
function com_member_findpwformCheck()
{
	call_member_ajax();

	var	mform	=	"com_member_findpw";
	var	rsXml	=	Ajax.rltXml();
	var	email_necessary	= Ajax.rltXmlOnce(rsXml, "email_necessary");

	FormCheck.setCheck(mform, 'com_member_findpw_name',	'y', '�̸�', '');
	FormCheck.setCheck(mform, 'com_member_findpw_id', 'y', '���̵�', 'num+eng');

	if(email_necessary == 'Y') {
		FormCheck.setCheck(mform, 'com_member_findpw_email', 'y', '�̸����ּ�',	'email');
	} else {
		var mType = "1";
		for(i=0; i<document.getElementsByName('member_type').length; i++) {
			if(document.getElementsByName('member_type')[i].checked == true) {
				mType = document.getElementsByName('member_type')[i].value;
				break;
			}
		}

		if(mType == 1) {
			FormCheck.setCheck(mform, 'com_member_findpw_ssn1',	'y', '��Ϲ�ȣ', 'num',	'6');
			FormCheck.setCheck(mform, 'com_member_findpw_ssn2',	'y', '��Ϲ�ȣ', 'jumin_number', '7',	'com_member_findpw_ssn1');
		} else {
			FormCheck.setCheck(mform, 'com_member_findpw_ssn1',	'y', '��Ϲ�ȣ', 'num+eng',	'9');
			FormCheck.setCheck(mform, 'com_member_findpw_ssn2',	'n', '��Ϲ�ȣ', 'jumin_number', '7',	'com_member_findpw_ssn1');
		}
	}

    if(FormCheck.init(mform)) {
        SSL.send({
            'formName':'com_member_findpw'
            ,'elementName':['com_member_findpw_name','com_member_findpw_id','com_member_findpw_email','com_member_findpw_ssn1','com_member_findpw_ssn2']
            ,'postName':'encrypted_str'
        });
        return false;
    } else {
        return false;
    }

	//return FormCheck.init(mform);
}

// ��й�ȣ	2�ܰ� �� üũ
function com_member_findpwformCheck2()
{
	var	mform =	"com_member_findpw";

	FormCheck.setCheck(mform, 'com_member_findpw_id', 'y', '���̵�', 'num+eng');
	FormCheck.setCheck(mform, 'com_member_findpw_answer', 'y', '�亯����', '');

	return FormCheck.init(mform);
}

// ȸ��Ż��	�� üũ
function com_member_secedeformCheck(mode)
{
	call_member_ajax();

	var	mform	=	"com_member_secede";
	var	rsXml	=	Ajax.rltXml();
	var	email_necessary	=	Ajax.rltXmlOnce(rsXml, "email_necessary");
	var	HTTP_HOST		=	Ajax.rltXmlOnce(rsXml, "HTTP_HOST");
	var	secede				=	Ajax.rltXmlOnce(rsXml, "secede");

	FormCheck.setCheck(mform, 'com_member_secede_pw', 'y', '��й�ȣ', '');
	FormCheck.setCheck(mform, 'com_member_secede_name',	'y', '�̸�', '');

	if(email_necessary == 'Y') {
		FormCheck.setCheck(mform, 'com_member_secede_email', 'y', '�̸����ּ�',	'email');
	}
	else {
        if(mode != 'ipin') {
            var mType = "1";
            for(i=0; i<document.getElementsByName('member_type').length; i++) {
                if(document.getElementsByName('member_type')[i].checked == true) {
                    mType = document.getElementsByName('member_type')[i].value;
                    break;
                }
            }

            if(mType == "1") {
                FormCheck.setCheck(mform, 'com_member_secede_ssn1',	'y', '��Ϲ�ȣ', 'num',	'6');
                FormCheck.setCheck(mform, 'com_member_secede_ssn2',	'y', '��Ϲ�ȣ', 'jumin_number', '7',	'com_member_secede_ssn1');
            } else {
                FormCheck.setCheck(mform, 'com_member_secede_ssn1',	'y', '��Ϲ�ȣ', 'num+eng',	'9');
                FormCheck.setCheck(mform, 'com_member_secede_ssn2',	'n', '��Ϲ�ȣ', 'jumin_number', '7',	'com_member_secede_ssn1');
            }
        }
	}

	var	jsCheck	=	FormCheck.init(mform);

	if(jsCheck == true)	{
		mreason	= false;
		for(var	i =	0; i < secede; i++)	{
			if(eval("document."	+ mform	+ ".elements['com_member_secede_reason[]'][" + i + "].checked")	== true)	mreason	= true;
		}

		if(mreason == false) {
			alert('Ż�������� �����ϼ���.');
			return false;
		}
	} else {
		return false;
	}
}


// ȸ��Ż��	�� üũ
function com_member_secedeformCheck_new() {
	call_member_ajax();

	var	mform	=	"com_member_secede";
	var	rsXml	=	Ajax.rltXml();
	var	email_necessary	=	Ajax.rltXmlOnce(rsXml, "email_necessary");
	var	HTTP_HOST		=	Ajax.rltXmlOnce(rsXml, "HTTP_HOST");
	var	secede				=	Ajax.rltXmlOnce(rsXml, "secede");

	FormCheck.setCheck(mform, 'com_member_secede_pw', 'y', '��й�ȣ', '');
	FormCheck.setCheck(mform, 'com_member_secede_name',	'y', '�̸�', '');

	if(email_necessary == 'Y') {
		FormCheck.setCheck(mform, 'com_member_secede_email', 'y', '�̸����ּ�',	'email');
	}
	else {
		var mType = "1";
		for(i=0; i<document.getElementsByName('member_type').length; i++) {
			if(document.getElementsByName('member_type')[i].checked == true) {
				mType = document.getElementsByName('member_type')[i].value;
				break;
			}
		}

		if(mType == "1") {
			//FormCheck.setCheck(mform, 'com_member_secede_ssn1',	'y', '��Ϲ�ȣ', 'num',	'6');
			//FormCheck.setCheck(mform, 'com_member_secede_ssn2',	'y', '��Ϲ�ȣ', 'jumin_number', '7',	'com_member_secede_ssn1');
		} else {
			FormCheck.setCheck(mform, 'com_member_secede_ssn1',	'y', '��Ϲ�ȣ', 'num+eng',	'9');
			FormCheck.setCheck(mform, 'com_member_secede_ssn2',	'n', '��Ϲ�ȣ', 'jumin_number', '7',	'com_member_secede_ssn1');
		}
	}

    var	jsCheck	=	FormCheck.init(mform);
	if(jsCheck == true)	{
		/*mreason	= false;
		for(var	i =	0; i < secede; i++)	{
			if(eval("document."	+ mform	+ ".elements['com_member_secede_reason[]'][" + i + "].checked")	== true)	mreason	= true;
		}
		if(mreason == false) {
			alert('Ż�������� �����ϼ���.');
			return false;
		}*/
	} else {
		return false;
	}
}



// ȸ������	- ��â
function com_member_apply_new()
{
	window.open("/chtml/member.php", "com_member_new_apply", "width=800,height=600,scrollbars=yes,status=yes");
}

// �Ǹ�����	��üũ
function com_member_namecheckformCheck()
{
	var	mform =	"com_member_namecheck";

	FormCheck.setCheck(mform, 'com_member_namecheck_name', 'y',	'�̸�',	'');
	FormCheck.setCheck(mform, 'com_member_namecheck_ssn1', 'y',	'�ֹε�Ϲ�ȣ',	'num', '6-6');
	FormCheck.setCheck(mform, 'com_member_namecheck_ssn2', 'y',	'�ֹε�Ϲ�ȣ',	'jumin_number',	'7-7', 'com_member_namecheck_ssn1');
	FormCheck.setCheck(mform, 'com_member_namecheck_check', 'y', '�����ĺ���ȣ����', 'checkbox', '', '', '');

	// ��������
	var age;
	Now = new Date();    //���� ������ ����
	NowYear = Now.getFullYear(); //���̸� ���ϴ� �Լ� ����

	var frm = document.com_member_namecheck;
	var j1=frm.com_member_namecheck_ssn1.value; //�� 6�ڸ��� �Է��� ���� j1 �� ����
	var j2=frm.com_member_namecheck_ssn2.value; //�� 7�ڸ��� �Է��� ���� j2 �� ����
	var n1=j1.substr(0,2);      //�� 6�ڸ��� �Է��� ���� �տ��� �α��ڸ� n1 �� ����
	var n2=j2.substr(0,1);      //�� 7�ڸ��� �Է��� ���� �Ǿ��� ���ڸ� n2 �� ����( 1~4)

	if((n2==1)||(n2==2)){     //�� ù°���� 1, 2�� ���(1900��뿡 ����� ����)
		age = (NowYear-(1900 + Number(n1)));
	}

	if ((n2==3)||(n2==4)){     //�� ù°���� 3, 4�� ���
		age=(NowYear-(2000 + Number(n1)));
	}

	if (age<19){
		alert('���� ���� ����Ʈ�� 19�� �̸��� ����� �� �����ϴ�.');
		return false;
	}

	return FormCheck.init(mform);
}

// �Ǹ�����	ó��
function com_member_namecheck_submit()
{
	if(com_member_namecheckformCheck() == false) return	false;
	else {
		//window.open('/chtml/member.php', document.com_member_namecheck.target, 'width=430,height=180,scrollbars=no');
        if(document.namecheckIframe == undefined) {
            if(window.addEventListener) {
                var iFramObj = document.createElement('iframe');
            }
            else {
                var iFramObj = document.createElement('<iframe name="namecheckIframe">');
            }

            iFramObj.name = "namecheckIframe";
            iFramObj.id = "namecheckIframe";
            iFramObj.style.display = 'none';
            document.body.appendChild(iFramObj);
        }

        document.com_member_namecheck.target = "namecheckIframe";

        document.com_member_namecheck.submit();
        return false;

	}
}

// �Ǹ�����	ó��(ȸ������)
function com_member_namecheck()
{
	var eSSNType = document.getElementsByName('ssn_type');
	var type = 1;

	if(eSSNType != null) {
		var iLength = eSSNType.length;

		for(var i=0; i<iLength; i++) {
			if(eSSNType[i].checked) {
				type = eSSNType[i].value;
			}
		}
	}

	if(type==1) {
		window.open('/chtml/member.php?com_member_basic=apply_namecheck_form', document.com_member.target, 'width=475,height=150,scrollbars=no');
	} else {
		alert('�ֹε�Ϲ�ȣ ���ĸ� �Ǹ������� �����մϴ�.');
	}
}


// ���ڿ� trim (�����, 2009-07-28)
// ____________________________________________________________________________
function trim(txt)
{
    return txt.replace(/^\s+|\s|$/g, '');
}




// input type=text�� ��ĭ�˻� (�����, 2009-07-28)
// ____________________________________________________________________________
function checkBlank(obj)
{
	if (trim(obj.value).length==0) return false;
	else return true;
}




// ���(reservation) ���ø����� ��ȸ���α��ο��� ��� (�����, 2009-07-28)
// ____________________________________________________________________________
function comMemberLoginNotSubmit()
{
	var frm = document.forms[0];
	if ((typeof frm=='object') && (frm.name=='comMemberLoginNot')) {
		var orderNo = document.getElementsByName('orderNo')[0];
		var userName = document.getElementsByName('userName')[0];
		var userJumin1 = document.getElementsByName('userJumin1')[0];
		var userJumin2 = document.getElementsByName('userJumin2')[0];

		if (checkBlank(orderNo)==false) {
			alert('�����ȣ�� �Է����ּ���.');
			orderNo.focus();
			return false;
		}
		else if (checkBlank(userName)==false) {
			alert('������ �Է����ּ���.');
			userName.focus();
			return false;
		}
		else if (checkBlank(userJumin1)==false) {
			alert('�ֹι�ȣ�� �Է����ּ���.');
			userJumin1.focus();
			return false;
		}
		else if (checkBlank(userJumin2)==false) {
			alert('�ֹι�ȣ�� �Է����ּ���.');
			userJumin2.focus();
			return false;
		}

		return true;
	}
}

/* ȸ������(�Ϲ�, ����, �ܱ���)���� ��ũ��Ʈ */
function comMemberRegNoTypeChange(str) {
	if(str=="c1"){
		member_c1.style.display="";
		member_c2.style.display="none";
		member_c3.style.display="none";
        document.getElementById('confirm_type_c1').style.display="none";
	}else if(str=="c2"){
		member_c1.style.display="none";
		member_c2.style.display="";
		member_c3.style.display="none";
        document.getElementById('confirm_type_c1').style.display="";
	}else{
		member_c1.style.display="none";
		member_c2.style.display="none";
		member_c3.style.display="";
        document.getElementById('confirm_type_c1').style.display="";

		if(str=="c3_1") {
			member_c3_1.style.display="";
			member_c3_2.style.display="none";
		} else if(str=="c3_2") {
			member_c3_1.style.display="none";
			member_c3_2.style.display="";
		}
	}
}

function comMemberSecedeTypeChange(type) {
	document.getElementById('com_member_secede_ssn1').value = "";
	document.getElementById('com_member_secede_ssn2').value = "";

	if(type=="1"){
        try {
            document.getElementById('secede_type_0').style.display="";
        } catch (e){}
		document.getElementById('com_member_secede_ssn1').setAttribute('size', 10);
		document.getElementById('com_member_secede_ssn1').maxLength = 6;
		document.getElementById('com_member_secede_blank').style.display="";
		document.getElementById('com_member_secede_ssn2').style.display="";
	}else if(type=="2"){
        try {
            document.getElementById('secede_type_0').style.display="";
        } catch (e){}
		document.getElementById('com_member_secede_ssn1').setAttribute('size', 13);
		document.getElementById('com_member_secede_ssn1').maxLength = 9;
		document.getElementById('com_member_secede_blank').style.display="none";
		document.getElementById('com_member_secede_ssn2').style.display="none";
	}else if(type=="0"){
        document.getElementById('secede_type_0').style.display="none";
    }
}

function comMemberFindIdTypeChange(type) {
	document.getElementById('com_member_findid_ssn1').value = "";
	document.getElementById('com_member_findid_ssn2').value = "";

	if(type=="1"){
        try {
            document.getElementById('find_type_0').style.display="none";
            document.getElementById('find_type_0_btn').style.display="none";
            document.getElementById('find_type_1').style.display="";
            document.getElementById('find_type_1_btn').style.display="";
        } catch (e){}
		document.getElementById('com_member_findid_ssn1').setAttribute('size', 10);
		document.getElementById('com_member_findid_ssn1').maxLength = 6;
		document.getElementById('com_member_findid_blank').style.display="";
		document.getElementById('com_member_findid_ssn2').style.display="";
	}else if(type=="2"){
        try {
            document.getElementById('find_type_0').style.display="none";
            document.getElementById('find_type_0_btn').style.display="none";
            document.getElementById('find_type_1').style.display="";
            document.getElementById('find_type_1_btn').style.display="";
        } catch (e){}
		document.getElementById('com_member_findid_ssn1').setAttribute('size', 13);
		document.getElementById('com_member_findid_ssn1').maxLength = 9;
		document.getElementById('com_member_findid_blank').style.display="none";
		document.getElementById('com_member_findid_ssn2').style.display="none";
	}else if(type=="0"){
        document.getElementById('find_type_0').style.display="";
        document.getElementById('find_type_0_btn').style.display="";
        document.getElementById('find_type_1').style.display="none";
        document.getElementById('find_type_1_btn').style.display="none";
    }
}

function comMemberFindPwTypeChange(type) {
	document.getElementById('com_member_findpw_ssn1').value = "";
	document.getElementById('com_member_findpw_ssn2').value = "";

	if(type=="1"){
        try {
            document.getElementById('find_type_0').style.display="none";
            document.getElementById('find_type_0_btn').style.display="none";
            document.getElementById('find_type_1').style.display="";
            document.getElementById('find_type_1_btn').style.display="";
        } catch (e){}
		document.getElementById('com_member_findpw_ssn1').setAttribute('size', 10);
		document.getElementById('com_member_findpw_ssn1').maxLength = 6;
		document.getElementById('com_member_findpw_blank').style.display="";
		document.getElementById('com_member_findpw_ssn2').style.display="";
	}else if(type=="2"){
        try {
            document.getElementById('find_type_0').style.display="none";
            document.getElementById('find_type_0_btn').style.display="none";
            document.getElementById('find_type_1').style.display="";
            document.getElementById('find_type_1_btn').style.display="";
        } catch (e){}
		document.getElementById('com_member_findpw_ssn1').setAttribute('size', 13);
		document.getElementById('com_member_findpw_ssn1').maxLength = 9;
		document.getElementById('com_member_findpw_blank').style.display="none";
		document.getElementById('com_member_findpw_ssn2').style.display="none";
	}else if(type=="0"){
        document.getElementById('find_type_0').style.display="";
        document.getElementById('find_type_0_btn').style.display="";
        document.getElementById('find_type_1').style.display="none";
        document.getElementById('find_type_1_btn').style.display="none";
    }
}

function comMemberRegNoTypeCheckUISetting(type1, type2, type3) {
	if(type1) {
		comMemberRegNoTypeChange("c1");
		document.getElementById('member1').checked = true;
	} else if(type2) {
		comMemberRegNoTypeChange("c2");
		document.getElementById('member2').checked = true;
	} else if(type3) {
		comMemberRegNoTypeChange("c3");
		document.getElementById('member3').checked = true;
	}

	if(!type1) {
		document.getElementById('member_l1').style.display = "none";
	}
	if(!type2) {
		document.getElementById('member_l2').style.display = "none";
	}
	if(!type3) {
		document.getElementById('member_l3').style.display = "none";
	}
}
/*
��ȸ�� �α���
*/
function comMemberLoginOrder(frm){
    if(frm.order_code.value==''){
        alert('�ֹ���ȣ �Ǵ� �ֹ��ڼ����� ��Ȯ�� �Է����ּ���');
        return false;
    }
    if(frm.oname.value==''){
        alert('�ֹ���ȣ �Ǵ� �ֹ��ڼ����� ��Ȯ�� �Է����ּ���');
        return false;
    }
    return true;
}

// ������ �˾�
function comMemberIpinPopup(value, type) {
    var builder_id = value.match(/\|([a-zA-Z0-9_]+)/);
    var form = document.createElement('form');
    form.method = 'post';
    form.target = 'popupIpin';
    form.action = 'https://i-pin.cafe24.com/ipin/ipin_auth_builder_request.php';
    var input_builderId = document.createElement('input');
    input_builderId.type = 'hidden';
    input_builderId.name = 'builderId';
    input_builderId.value = builder_id[1];
    form.appendChild(input_builderId);
    var input_ipin_returnUrl = document.createElement('input');
    input_ipin_returnUrl.type = 'hidden';
    input_ipin_returnUrl.name = 'ipin_returnUrl';
    input_ipin_returnUrl.value = value.replace(/\|[a-zA-Z0-9_]+/, '');
    form.appendChild(input_ipin_returnUrl);

    if(type == 'find_pw') {
        var com_member_findpw_id_value = document.getElementsByName('com_member_findpw_id')[0].value;
        if(!com_member_findpw_id_value) {
            alert('���̵� ��Ȯ�� �Է��� �ּ���.');
            document.getElementsByName('com_member_findpw_id')[0].focus();
            return false;
        } else {
            var input_find_pw = document.createElement('input');
            input_find_pw.type = 'hidden';
            input_find_pw.name = 'ipin_param1';
            input_find_pw.value = com_member_findpw_id_value;
            form.appendChild(input_find_pw);
        }
    }

    document.body.appendChild(form);
    window.name ="ipin_parent_window";

    if(type != 'reseller_company_ipin') {
        Ajax.init("/chtml/member.php?mode=checkIpin", null , 'GET' , function(req) {
            var result = Ajax.rltText(req);
            if(result == 'Y') {
                window.open('', 'popupIpin','width=448, height=500');
                form.submit();
                if(type == 'find_id' || type == 'find_pw') {
                    window.close();
                }
            } else if(result == 'N') {
                alert('������ ���� ���Ⱓ�� ���� �Ǿ����ϴ�.');
            } else {
                alert('�����ڿ��� ������ ���� ��û�� �Ͻñ� �ٶ��ϴ�.');
            }
        });
    } else {
        form.target = '';
        form.submit();
    }
}

// �ڵ��� ���� �˾�
function comMemberCertifyMobilePopup(value, type) {
    var builder_id = value.match(/\|([a-zA-Z0-9_]+)/);
    var form = document.createElement('form');
    form.method = 'post';
    form.target = 'auth_popup';
    form.action = 'https://ipin.cafe24.com/certify/v1/?action=auth';
    
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'service';
    input.value = 'builder';
    form.appendChild(input);

    input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'authModule';
    input.value = 'kcp';
    form.appendChild(input);

    input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'authType';
    input.value = 'mobile';
    form.appendChild(input);

    input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'method';
    input.value = 'POST';
    form.appendChild(input);

    input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'builderId';
    input.value = builder_id[1];
    form.appendChild(input);

    input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'returnUrl';
    input.value = value.replace(/\|[a-zA-Z0-9_]+/, '');
    form.appendChild(input);
    
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'returnPort';
    input.value = '80';
    form.appendChild(input);

    if(type == 'find_pw') {
        var com_member_findpw_id_value = document.getElementsByName('com_member_findpw_id')[0].value;
        var csrf_member_token  = document.getElementsByName('csrf_member_token')[0].value;
        if(!com_member_findpw_id_value) {
            alert('���̵� ��Ȯ�� �Է��� �ּ���.');
            document.getElementsByName('com_member_findpw_id')[0].focus();
            return false;
        } else {
            var input_find_pw = document.createElement('input');
            input_find_pw.type = 'hidden';
            input_find_pw.name = 'param1';
            input_find_pw.value = com_member_findpw_id_value;
            form.appendChild(input_find_pw);
            
            var input_find_pw = document.createElement('input');
            input_find_pw.type = 'hidden';
            input_find_pw.name = 'param2';
            input_find_pw.value = csrf_member_token;
            form.appendChild(input_find_pw);
        }
    }else if(type == 'find_id') {
    	var csrf_member_token  = document.getElementsByName('csrf_member_token')[0].value;
    	var input_find_pw = document.createElement('input');
        input_find_pw.type = 'hidden';
        input_find_pw.name = 'param2';
        input_find_pw.value = csrf_member_token;
        form.appendChild(input_find_pw);
    }

    document.body.appendChild(form);
    window.name ="certify_mobile_parent_window";

    if(type != 'reseller_company_ipin') {
        Ajax.init("/chtml/member.php?mode=checkCertifyMobile", null , 'GET' , function(req) {
            var result = Ajax.rltText(req);
            if(result == 'Y') {
                window.open('', 'auth_popup','width=448, height=500');
                form.submit();
                if(type == 'find_id' || type == 'find_pw') {
                    window.close();
                }
            } else if(result == 'N') {
                alert('�޴��� ���� ���Ⱓ�� ���� �Ǿ����ϴ�.');
            } else {
                alert('�����ڿ��� �޴��� ���� ��û�� �Ͻñ� �ٶ��ϴ�.');
            }
        });
    } else {
        form.target = '';
        form.submit();
    }
}

// ������ ���ΰ���
function check_reseller_company_reg(auth_type)
{
    var company_name = document.getElementsByName('company_name')[0];
    var company_number_1 = document.getElementsByName('company_number_1')[0];
    var company_number_2 = document.getElementsByName('company_number_2')[0];
    var company_number_1_2 = document.getElementsByName('company_number_1_2')[0];
    var company_number_2_2 = document.getElementsByName('company_number_2_2')[0];
    var company_number_3_2 = document.getElementsByName('company_number_3_2')[0];

    if(!company_name.value) {
        alert('���θ��� ��Ȯ�� �Է��� �ּ���.');
        company_name.focus();
        return false;
    }
    if(!company_number_1.value) {
        alert('���ε�Ϲ�ȣ�� ��Ȯ�� �Է��� �ּ���.');
        company_number_1.focus();
        return false;
    }
    if(!company_number_2.value) {
        alert('���ε�Ϲ�ȣ�� ��Ȯ�� �Է��� �ּ���.');
        company_number_2.focus();
        return false;
    }
    if(!company_number_1_2.value) {
        alert('����ڵ�Ϲ�ȣ�� ��Ȯ�� �Է��� �ּ���.');
        company_number_1_2.focus();
        return false;
    }
    if(!company_number_2_2.value) {
        alert('����ڵ�Ϲ�ȣ�� ��Ȯ�� �Է��� �ּ���.');
        company_number_2_2.focus();
        return false;
    }
    if(!company_number_3_2.value) {
        alert('����ڵ�Ϲ�ȣ�� ��Ȯ�� �Է��� �ּ���.');
        company_number_3_2.focus();
        return false;
    }

    if(auth_type == 'mobile') {
        document.com_member.target = 'auth_popup';
        window.open('', 'auth_popup', 'width=430,height=354,scrollbars=no');
    } else {
        document.com_member.target = 'new';
        window.open('', 'new', 'width=430,height=354,scrollbars=no');
    }

    // ���� ������ ȣȯ��
    if(auth_type) {
        document.getElementsByName('auth_type')[0].value = auth_type;
        document.com_member.submit();
    }

    return true;
}