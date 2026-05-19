/*****************************************************************
   deletion of the current branch prohibited
   powered by nnin ( http://www.nnin.com )
*****************************************************************/




/*jslint browser: true*/
/*global $, jQuery*/

$(function () {

    

    
    /* 메인슬라이딩 시간간격 : de01, de02, de03 공통적용 */
//    $('.carousel').carousel({
//        interval: 5000
//    });
    
    
    
    
    
    /* 상단고정 */
    $(window).scroll(function () {
        var gnb = $('.gnb');
        
        if ($(this).scrollTop() > 10) {
            gnb.addClass('on');
            gnb.find('.mainmenu').addClass('on');
            $('.nt_sitemap').addClass('on');
        } else {
            gnb.removeClass('on');
            gnb.find('.mainmenu').removeClass('on');
            $('.nt_sitemap').removeClass('on');
        }
    });
    


    /* 네비게이션 분류 */
	$('.mainmenu ul li').on({
		mouseover : function () {
			$(this).find('.submenu').stop().slideDown(200);
		},
		mouseout : function () {
			$(this).find('.submenu').stop().slideUp(200);
		},
		click: function () {
            if ($(window).width() < 768) {
                $(this).find('> a').attr('href', '#none');
            }
            
			$(this).toggleClass('s_on');
			if ($(this).hasClass('s_on')) {
				$(this).find('.submenu').slideDown();
				$(this).siblings().removeClass('s_on');
			} else {
				$(this).find('.submenu').slideUp();
			}
		}
	});
    
    
    
    
    /**/
    $('.nt_quick').on({
		mouseover : function () {
			$(this).find('ul').stop().slideDown(200);
		},
		mouseout : function () {
			$(this).find('ul').stop().slideUp(400);
		}
	});
    
    
    
    
    
    /**/
    $('.nt_shop').on({
		mouseover : function () {
			$(this).find('ul').stop().slideDown(200);
		},
		mouseout : function () {
			$(this).find('ul').stop().slideUp(400);
		},
        click: function () {
			$(this).toggleClass('s_on');
			if ($(this).hasClass('s_on')) {
				$(this).find('ul').slideDown();
			} else {
				$(this).find('ul').slideUp();
			}
		}
	});
    
    
    
    


    /**/
	$('.logoArea p').click(function () {
		$(this).toggleClass('on');

		if ($(this).hasClass('on')) {
			$('.mainmenu').slideDown();
		} else {
			$('.mainmenu').slideUp();
		}
	});


//	$('.logoArea .logo').on({
//		mouseenter: function () {
//			$(this).find('.logo_off').stop().animate({
//				opacity: 0,
//				left: 20
//			}, 300);
//			$(this).find('.logo_on').stop().animate({
//				opacity: 1,
//				left: 0
//			}, 300);
//		},
//		mouseleave: function () {
//			$(this).find('.logo_off').stop().animate({
//				opacity: 1,
//				left: 0
//			}, 300);
//			$(this).find('.logo_on').stop().animate({
//				opacity: 0,
//				left: 20
//			}, 300);
//		}
//	});


    
    
    

    /* scrolltop */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    $('.scrollToTop').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    
    
    
    
    

    /**/
    $('.n_swap').each(function () {
		var $this = $(this);

		$this.bind('mouseenter', function () {
			var srcArr = $(this).attr('src').split('.');

			$(this).attr('src', srcArr[0] + '_on.' + srcArr[1]);
			$(this).addClass('on');
		}).bind('mouseleave', function () {
			$(this).attr('src', $(this).attr('src').replace('_on', ''));
			$(this).removeClass('on');
		});
	});
    
    
    
    
    
    /* 툴팁 */
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    
    
    
    
    
    /* 이미지 확대,축소 */
	$('.scaleUp').on({
		mouseover: function () {
			$(this).addClass('on');
		},
		mouseout: function () {
			$(this).removeClass('on');
		}

	});
    
    $('.scaleDown').on({
		mouseover: function () {
			$(this).addClass('on');
		},
		mouseout: function () {
			$(this).removeClass('on');
		}

	});
    
    

    

	/* 효과01 */
	$('.effect01').each(function () {
	    $(this).on({
	        mouseenter: function () {
	            $(this).find('.effect01-box').stop().animate({
	                bottom: 0,
	                opacity: 1
	            }, 200);
	        },
	        mouseleave: function () {
	            $(this).find('.effect01-box').stop().animate({
	                bottom: -50,
	                opacity: 0
	            }, 200);
	        }
	    });
	    $(this).css({
	        cursor: 'pointer'
	    });
	});


    
    

	/* 효과02 */
	$('.effect02').each(function () {

	    $(this).on({
	        mouseenter: function () {
	            $('.effect02-box').stop().animate({
	                top: 20,
	                opacity: 0.2
	            }, 100);
	            $(this).find('.effect02-box').stop().animate({
	                top: 0,
	                opacity: 1.0
	            }, 200);
	        },
	        mouseleave: function () {
	            $('.effect02-box').stop().animate({
	                top: 10,
	                opacity: 0.8
	            }, 100);
	            $(this).find('.effect02-box').stop().animate({
	                top: 10,
	                opacity: 0.8
	            }, 200);
	        }
	    });
	    $(this).css({
	        cursor: 'pointer'
	    });
	});



    
    
    
	/* 효과03 */
	$('.effect03').each(function () {
	    $(this).on({
	        mouseenter: function () {
	            $(this).find('.effect03-box').stop().animate({
	                top: '50%',
	                opacity: 1
	            }, 200);
	        },
	        mouseleave: function () {
	            $(this).find('.effect03-box').stop().animate({
	                top: '40%',
	                opacity: 0
	            }, 200);
	        }
	    });
	    $(this).css({
	        cursor: 'pointer'
	    });
	});
    
    
    
    
    
    
    /* map 지도 : 구글지도 */
    $('.map_google').click(function () {
        $(this).find('iframe').addClass('clicked');
    }).mouseleave(function () {
        $(this).find('iframe').removeClass('clicked');
    });
    
    
    
    
    
    
    
    /*****************************************************************
    - 아래 제작사를 삭제 하시면 디자인닌의 추가서비스를 이용 하실 수 없습니다.
    - 삭제를 희망 하시면 X2.0의 비용으로 모든 추가서비스를 이용 하실 수 있습니다.
    *****************************************************************/
    $('.n_copyright').append(' <span><a href="http://www.nnin.com"> powered by nnin</a></span>');
    $('.n_copyright span').css({display: 'inline-block', marginBottom: '5px'});
    $('.n_copyright span a').attr('target', '_blank');
    
    
    
    
    
    
    
    
    
    /************************************************************
    게시판
    ************************************************************/
    
    /*게시판:공통*/
    $('.n_board_txt, .n_board_gallery').find('table[border="1"]').attr('border', '0');
    
    
    /* 카테고리 영역 ****************************************/
    $('form[name=com_board_form]').parent().addClass('categoryArea');
    $('form[name=com_board_form]').parent().find('td').removeAttr('align');
//    $('form[name=com_board_form]').parent().css('marginBottom', '5px');
//    $('form[name=com_board_form]').parent().find('img').remove();
//    $('form[name=com_board_form]').parent().find('td > b').remove();

    
        
    
    /* 댓글영역 ***********************************************/
    /* 댓글영역 : 작성 */
    $('.board_comment_bgcolor tbody:not(:first-child)').css({
        'border': '0px solid #f00',
        'padding': '0 10px',
        'display': 'block'
    });
    /* 댓글영역 : 작성영역 */
    $('.comment_txt > textarea').css({
        'margin': '0 0 5px',
        'padding': '10px',
        'border': '1px solid #ccc',
        'height': '100px'
    });
    /* 댓글영역 : 작성영역 : 버튼(댓글달기) */
    $('.comment_txt > input[type=image]').css({
        'paddingRight': '10px',
        'float': 'left'
    });
    
    /* 댓글영역 : 댓글목록 */
    $('.comment_name').parent('tr').children('td').removeAttr('width');
    $('.comment_name').parent('tr').children('td:nth-child(2)').addClass('comment_view');
    $('.comment_name').parent('tr').children('td:nth-child(3)').addClass('comment_hour');
    
    /* 댓글영역 : 댓글목록 */
    $('.comment_name').parent().parent().parent().parent().parent().parent().parent().addClass('commentArea');
    
    
    
    
    
    
    /* 텍스트형 : 글목록 : 최상단 라인영역 */
    $('.n_board_txt .bbsno').parents('table').prev().find('td').addClass('board_top_line');
    
    /* 텍스트형 : 글목록 'tr' 선택*/
    $('.n_board_txt .bbsno').parent('tr').addClass('tr_line');
    
    /* 텍스트형 : 글목록 : 최상단 구분영역 */
    $('.n_board_txt .att_title').parent('tr').addClass('boardTitBar');
    
    /* 텍스트형 : 글목록 : 최상단 행 속성 */
    $('.n_board_txt .att_title font').removeAttr('style');
    
    /* 텍스트형 : 글보기 / 글쓰기*/
    $('.n_board_txt .board_bgcolor, .n_board_gallery .board_bgcolor').parent('tr').addClass('diviedLine');
    
    /* 텍스트형 : 목록전체영역 : 하단여백*/
    $('.boardTitBar').parent().parent().css('marginBottom', '20px');
    
    /* 공통 : 목록 : 하단 영역들 */
    $('.paging').css('padding', '10px 0');
    $('.paging').parent().parent().parent().prev().css('border', '1px solid #fff');
    $('.paging').parent('tr').next().remove();
    
    
    
    
    
    
    // 갤러리목록 : 관리자로그인시 게시물체크박스
    $('.n_board_gallery').find('input[name=delete_check_notice\\[\\]]').parent('td').addClass('adminCheck');
    
    $('.n_board_gallery').find('input[name=delete_check_notice\\[\\]]').addClass('adminCheckBox');
    
    // 갤러리목록 : 이미지선택(제목을 사용해야 됨)
    $('.gallery_subject').parent().siblings('tr:first-child').addClass('nSize');
    
    // 갤러리목록 : 사이즈
    $('.nSize').parents('.bbsnewf5').parents('td').addClass('boxArea');
    
    // 텍스트 내용
    $('.gallery_etc').css('color', '#fff');
    
    
    
    

    
    /* 폼메일 : 항목의 속성 제거 ***********************************************/
    $('.formmail_title_bgcolor font').removeAttr('style');
    /* 개인정보 수집동의 영역 */
    $('.np_form input[name=com_formmail_check_safe]').closest('table').addClass('personalInformation');
    /* 스팸등록방지 영역 */
    $('#captcha').closest('tr').addClass('captcha');
    /* 폼메일 : 하단버튼영역 : 상단여백 */
    $('a[href="javascript: document.com_formmail.reset();"]').parent().addClass('formButton');
    /* 폼메일 : 하단버튼영역 : 버튼 : 확인 */
    $('.formButton a:first-child img').attr('src', '../img/component/board/board_1/confirm.gif');
    /* 폼메일 : 하단버튼영역 : 버튼 : 취소 */
    $('.formButton a:last-child img').attr('src', '../img/component/board/board_1/cancel.gif');
    
    
    
    
    
    
    /* 글쓰기 : 하단버튼영역의 상단여백 */
    $('a[href="javascript: document.com_board.reset()"]').parent().parent().parent().parent().addClass('nbButton');
    
    /* 글보기 : 하단버튼영역 */
    $('img[align=absmiddle]').closest('table').parent().parent().parent().parent().addClass('veiwBottonArea');
    
    /* 글보기 : 하단라인 & 글목록리스트 */
    $('.veiwBottonArea').siblings('table:last').find('td').css('backgroundColor', '#fff');
    
    /* 글보기 : 하단 버튼 */
    $('img[src="/cimg/btn_sdel.gif"]').attr('src', '../img/component/board/board_1/admin_delete.gif');
    $('img[src="/cimg/move.gif"]').attr('src', '../img/component/board/board_1/admin_move.gif');
    $('img[src="/cimg/copy.gif"]').attr('src', '../img/component/board/board_1/admin_copy.gif');
    
    
    
    
    
    
    
    /*****************************************************************
    일정관리
    *****************************************************************/
    $('.np_schedule table').attr('width', '100%');
    $('.np_schedule').find('input[name=subject]').attr('size', '').css('width', '100%');
    
    
    

    
    
    /*****************************************************************
    쇼핑몰 : 페이징
    *****************************************************************/
    $('.tb_font04').parent().siblings('td[width=1]').remove();

    
    
    

    
    
    /*****************************************************************
    Animations
    *****************************************************************/
    var contentWayPoint = function () {
        $('.animate-box').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('animatedFast')) {

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            
                            var effect = el.data('animate-effect');
                            
                            if (effect === 'fadeInUp') {
                                el.addClass('fadeInUp animatedFast');
                            } else if (effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft animatedFast');
                            } else if (effect === 'fadeInRight') {
                                el.addClass('fadeInRight animatedFast');
                            } else if (effect === 'fadeInDown') {
                                el.addClass('fadeInDown animatedFast');
                            } else {
                                el.addClass('fadeInUp animatedFast');
                            }
                            
                            el.removeClass('item-animate');
                            
                        }, k * 300, 'easeInOutExpo');
                    });

                }, 80);
            }
        }, {
            offset: '95%'
        });
    };

    // Document on load.
    $(function () {
        contentWayPoint();
    });
    
    
    
    
    

    
    
    
    
    
});
















