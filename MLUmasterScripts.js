// BOXSCORE
	// Getting URL Parameters
		var getUrlParameter = function getUrlParameter(sParam) {
			var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			sURLVariables = sPageURL.split('&'),
			sParameterName,
			i;
			for (i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? true : sParameterName[1];
				};
			};
		};
		var gameId = getUrlParameter('ga');
		var allInfo;
	// End Getting URL Parameters

	// Picking Data and Setup
		$(document).ready(function() {
			if($('#boxScoreBoxHead').length) {
				hideHeader();
				getStatsBoxScore(location.search);
				extrasBoxscore();
				setInterval(getStatsBoxScore(location.search), 10000);
				$( document ).tooltip({
					hide: { effect: "fade", duration: 10 },
					content: function () {
						return $(this).prop('title');
					}
				});
			};
		});
		function getStatsBoxScore() {
			$.ajax({
				url:"https://mlustats.herokuapp.com/api/score?gid=" + gameId,
				type: "get",
				success:function(data){
					allInfo = data;
					if (data.data[0][0].Status == "Upcoming") {
						getMatchupInfo();
					} else {
						if (data.data[0][0].Fucked == 0) {
							processDataBoxScore(data);
		            		drawChartTimeline(data);
					        overLayIt();
					        $('#bs-statbox-home-stats-basic').tablesorter({ sortList: [[1,1]], sortInitialOrder: 'desc' });
					        $('#bs-statbox-home-stats-percentage').tablesorter({ sortList: [[1,1]], sortInitialOrder: 'desc' });
					        $('#bs-statbox-home-stats-advanced').tablesorter({ sortList: [[1,1]], sortInitialOrder: 'desc' });
					        $('#bs-statbox-home-stats-extra').tablesorter({ sortList: [[1,1]], sortInitialOrder: 'desc' });
					        $('#bs-statbox-away-stats-basic').tablesorter({ sortList: [[1,1]], sortInitialOrder: 'desc' });
					        $('#bs-statbox-away-stats-percentage').tablesorter({ sortList: [[1,1]], sortInitialOrder: 'desc' });
					        $('#bs-statbox-away-stats-advanced').tablesorter({ sortList: [[1,1]], sortInitialOrder: 'desc' });
					        $('#bs-statbox-away-stats-extra').tablesorter({ sortList: [[1,1]], sortInitialOrder: 'desc' });
					        $('.tablesorter').DataTable({"pagingType": "simple", "order": [[2,"desc"]], "iDisplayLength": 5, "bLengthChange": 5});
					    } else {
					    	processDataBoxScoreBroken(data.data[0]);
					    };
					};
				},
			});
		};
		var getMatchupInfo = function() {
			$.ajax({
				url:"https://mlustats.herokuapp.com/api/v1/matchup?gid=" + gameId,
				type: "get",
				success: function(data) {
					processMatchupInfo(data);
	    			$('.tablesorter').DataTable({"bAutoWidth": "false", "pagingType": "simple", "select": "true", "order": [[1,"desc"]]});
				},
			});
		};
	// End Picking Data and Setup

	// Creating True Boxscore
		var processDataBoxScore = function(data) { var head = 
			'<div id="bs-container-wrapper">' +
				'<div id="bs-container">';
					if (data.data[0][0].Status == "In Progress") { head +=
						'<h1 class="timeDate">Q' + data.data[0][0].Quarter + ' - '; var clock = data.data[0][0].Time; if ((clock).slice(0,1) == "0") {head += (data.data[0][0].Time).slice(1,5)} else {head += data.data[0][0].Time}; head += '</h1>';
					} else { head +=
						'<h1 class="timeDate">' + data.data[0][0].ga_start_time + '</h1>';
					}; head +=
					'<div id="bs-top-container">' +
						'<div id="bs-away-top">' +
							'<div id="bs-away-team-top" class="bs-away-team bs-team-top" ><img class ="boxscore" src="http://www.mlultimate.com' + data.data[0][0].AwayTeamPic + '"><h3 class="team-name"> ' + data.data[0][0].AwayTeamCity + ' ' + data.data[0][0].AwayTeam + '</h3><h7> ' + data.data[0][0].AwayRecord + '</h7></div>' +
							'<div id="bs-away-score-top" class="bs-away-team bs-score-top"><h1 class="bs-score">' + data.data[2][0].AwayScore + '</h1></div>' +
							'<div id="bs-away-holds-top" class="bs-away-team bs-holds-top"><h2 class="bs-score">' + data.data[4][0].AwayHolds + '</h2><h4>HOLDS</h4></div>' +
							'<div id="bs-away-breaks-top" class="bs-away-team bs-breaks-top"><h2 class="bs-score">' + data.data[4][0].AwayBreaks + '</h2><h4>BREAKS</h4></div>' +
						'</div>' +
						'<div id="bs-home-top">' +
							'<div id="bs-home-score-top" class="bs-home-team bs-score-top"><h1 class="bs-score">' + data.data[1][0].HomeScore + '</h1></div>' +
							'<div id="bs-home-team-top" class="bs-home-team bs-team-top"><img class ="boxscore" src="http://www.mlultimate.com' + data.data[0][0].HomeTeamPic + '"><h3 class="team-name"> ' + data.data[0][0].HomeTeamCity + ' ' + data.data[0][0].HomeTeam + '</h3><h7> ' + data.data[0][0].HomeRecord + '</h7></div>' +
							'<div id="bs-home-holds-top" class="bs-home-team bs-holds-top"><h2 class="bs-score">' + data.data[3][0].HomeHolds + '</h2><h4>HOLDS</h4></div>' +
							'<div id="bs-home-breaks-top" class="bs-home-team bs-breaks-top"><h2 class="bs-score">' + data.data[3][0].HomeBreaks + '</h2><h4>BREAKS</h4></div>' +
						'</div>' +
						'<div id="bs-table-bottom">' +
							'<table id="bs-bottom">' +
								'<thead>' +
									'<tr>' +
										'<th></th>' +
										'<th>Q1</th>' +
										'<th>Q2</th>' +
										'<th>Q3</th>' +
										'<th>Q4</th>' +
										'<th>OT</th>' +
										'<th>F</th>' +
									'</tr>' +
								'</thead>' +
								'<tbody>' +
									'<tr>' +
										'<td class="team-name">' + data.data[0][0].HomeTeamShort + '</td>' +
										'<td>' + data.data[1][0].Home1 + ' (' + data.data[1][0].HomeDPoint1 + ')</td>' +
										'<td>' + data.data[1][0].Home2 + ' (' + data.data[1][0].HomeDPoint2 + ')</td>' +
										'<td>' + data.data[1][0].Home3 + ' (' + data.data[1][0].HomeDPoint3 + ')</td>' +
										'<td>' + data.data[1][0].Home4 + ' (' + data.data[1][0].HomeDPoint4 + ')</td>' +
										'<td>' + data.data[1][0].HomeOT + ' (' + data.data[1][0].HomeDPointOT + ')</td>' +
										'<td>' + data.data[1][0].HomeScore + ' (' + data.data[3][0].HomeBreaks + ')</td>' +
									'</tr>' +
									'<tr>' +
										'<td class="team-name">' + data.data[0][0].AwayTeamShort + '</td>' +
										'<td>' + data.data[2][0].Away1 + ' (' + data.data[2][0].AwayDPoint1 + ')</td>' +
										'<td>' + data.data[2][0].Away2 + ' (' + data.data[2][0].AwayDPoint2 + ')</td>' +
										'<td>' + data.data[2][0].Away3 + ' (' + data.data[2][0].AwayDPoint3 + ')</td>' +
										'<td>' + data.data[2][0].Away4 + ' (' + data.data[2][0].AwayDPoint4 + ')</td>' +
										'<td>' + data.data[2][0].AwayOT + ' (' + data.data[2][0].AwayDPointOT + ')</td>' +
										'<td>' + data.data[2][0].AwayScore + ' (' + data.data[4][0].AwayBreaks + ')</td>' +
									'</tr>' +
								'</tbody>' +
							'</table>' +
						'</div>' +
					'</div>' +
					'<div id="bs-info-bottom">' +
						'<div id="bs-weather-container">' +
							'<img class="accuImg" src="http://mludev.staging.wpengine.com/wp-content/uploads/2016/01/AccuWeather.png">' +
							'<div id="bs-weather-container-info">' +
								'<div id="location-text">' +
									'<h4>' + data.data[0][0].Location + '</h4>' +
								'</div>' +
								'<div id="weather-text">' +
									'<img src="http://mludev.staging.wpengine.com/wp-content/themes/valenti-child/library/images/weather-icon.png">  <h4>' + data.data[0][0].ga_weather + ' Degrees</h4>' +
								'</div>' +
								'<div id="wind-text">' +
									'<img src="http://mludev.staging.wpengine.com/wp-content/themes/valenti-child/library/images/wind-icon.png">  <h4>' + data.data[0][0].ga_wind + ' MPH</h4>' +
								'</div>' +
							'</div>' +
						'</div>' + 
						'<div id="bs-performers-container">' +
							'<div id="bs-performers-text">TOP PERFORMERS</div>' +
							'<div id="bs-performers">' +
								'<div id="bs-performers-home" class="performersTop"><a href="http://mlultimate.com/player/?pid=' + data.data[7][0].PlayerID + '">' + data.data[7][0].Player + '</a> ' + data.data[7][0].Goals + ' G ' + data.data[7][0].Assists + ' A ' + data.data[7][0].Blocks + ' B </div>' +
								'<div id="bs-performers-away" class="performersTop"><a href="http://mlultimate.com/player/?pid=' + data.data[7][1].PlayerID + '">' + data.data[7][1].Player + '</a> ' + data.data[7][1].Goals + ' G ' + data.data[7][1].Assists + ' A ' + data.data[7][1].Blocks + ' B </div>' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';
			$('#boxScoreBoxHead').html(head); var summary =
			'<div id="bs-sum-home">' +
		        '<table id="bs-sum-home-stats">' +
		            '<thead>' +
		                '<tr>' +
		                	'<th colspan="2"><a class="show-popup" href="#" data-showpopup="1">Whats this? >>></a></th>' +// '<div class="overlay-bg"></div><div class="overlay-content popup1"><p>This is a popup</p><button class="close-btn">Close</button></div>' +
		                    '<th title="Touches per Offensive Possession &#10; -Total touches per offensive possession for the entire team">TPOP</th>' +
		                    '<th title="Breaks &#10; -Total number of breaks recorded by the team OR goals scored by a team that started a point on defense">BR</th>' +
		                    '<th title="Holds &#10; -Total number of holds recorded by the team OR goals scored by a team that started the point on offense">HD</th>' +
		                    '<th title="Total Scoring Efficiency &#10; -Percentage of the time that the team scored on a given possession, regardless of hold/break opportunity">TSE</th>' +
		                    '<th title="Offensive Scoring Efficiency &#10; -Percentage of the time that the team scored during a point that they began on offense">OSE</th>' +
		                    '<th title="Hold Possession Scoring Efficiency &#10; -Percentage of the time that the team scored a given hold opportunity">HPSE</th>' +
		                    '<th title="First Hold Scoring Efficiency &#10; -Percentage of the time that the team scored their first hold opportunity">FHSE</th>' +
		                    '<th title="Defensive Scoring Efficiency &#10; -Percentage of the time that the team scored during a point that they began on defense">DSE</th>' +
		                    '<th title="Break Possession Scoring Efficiency &#10; -Percentage of the time that the team scored a given break opportunity">BPSE</th>' +
		                    '<th title="First Break Scoring Efficiency &#10; -Percentage of the time that the team scored their first break opportunity">FBSE</th>' +
		                    '<th title="Defensive Turnover Efficiency &#10; -Percentage of the time that the team forced a turnover on their first defensive possession">DTE</th>' +
		                    '<th title="Throws &#10; -Total number of attempted throws by the entire team">THR</th>' +
		                    '<th title="Completion Percentage &#10; -Total number of completed throws over total number of attempted throws">COMP%</th>' +
		                    '<th title="Blocks &#10; -Total number of defensive blocks recorded by entire team">B</th>' +
		                    '<th title="Turnovers &#10; -Total number of turnovers committed by entire team">T</th>' +
		                    '<th title="Fouls &#10; -Total number of fouls committed by entire team">F</th>' +
		                '</tr>' +
		            '</thead>' +
		            '<tbody>' +
		            	'<tr>' +
		            		'<td><h2 class="bs-sum-final-score">' + data.data[2][0].AwayScore + '</h2></td>' +
		            		'<td><img src="http://www.mlultimate.com' + data.data[0][0].AwayTeamPic + '" class="bs-sum"> <p class="bs-team-name-in-table">' + data.data[0][0].AwayTeamCity + ' ' + data.data[0][0].AwayTeam + '</p></td>' +
		                    '<td class="dStat">' + data.data[4][0].AwayTPOP + '</td>' +
		                    '<td class="dStat">' + data.data[4][0].AwayBreaks + '</td>' +
		                    '<td class="dStat">' + data.data[4][0].AwayHolds + '</td>' +
		                    '<td class="dStat">' + data.data[4][0].AwayTSE + '%</td>' +
		                    '<td class="oStat">' + data.data[4][0].AwayOSE + '%</td>' +
		                    '<td class="oStat">' + data.data[4][0].AwayOPSE + '%</td>' +
		                    '<td class="oStat">' + data.data[4][0].AwayFPSE + '%</td>' +
		                    '<td class="dStat">' + data.data[4][0].AwayDSE + '%</td>' +
		                    '<td class="dStat">' + data.data[4][0].AwayDPSE + '%</td>' +
		                    '<td class="dStat">' + data.data[4][0].AwayFBSE + '%</td>' +
		                    '<td class="dStat">' + data.data[4][0].AwayDTE + '%</td>' +
		                    '<td class="oStat">' + data.data[4][0].AwayThrows + '</td>' +
		                    '<td class="oStat">' + data.data[4][0].AwayCompPerc + '%</td>' +
		                    '<td class="oStat">' + data.data[4][0].AwayBlocks + '</td>' +
		                    '<td class="oStat">' + data.data[4][0].AwayTurnovers + '</td>' +
		                    '<td class="oStat">' + data.data[4][0].AwayFouls + '</td>' +
		                '</tr>' +
		                '<tr>' +
		                	'<td><h2 class="bs-sum-final-score">' + data.data[1][0].HomeScore + '</h2></td>' +
		                	'<td><img src="http://www.mlultimate.com' + data.data[0][0].HomeTeamPic + '" class="bs-sum"> <p class="bs-team-name-in-table">' + data.data[0][0].HomeTeamCity + ' ' + data.data[0][0].HomeTeam + '</p></td>' +
		                    '<td class="dStat">' + data.data[3][0].HomeTPOP + '</td>' +
		                    '<td class="dStat">' + data.data[3][0].HomeBreaks + '</td>' +
		                    '<td class="dStat">' + data.data[3][0].HomeHolds + '</td>' +
		                    '<td class="dStat">' + data.data[3][0].HomeTSE + '%</td>' +
		                    '<td class="oStat">' + data.data[3][0].HomeOSE + '%</td>' +
		                    '<td class="oStat">' + data.data[3][0].HomeOPSE + '%</td>' +
		                    '<td class="oStat">' + data.data[3][0].HomeFPSE + '%</td>' +
		                    '<td class="dStat">' + data.data[3][0].HomeDSE + '%</td>' +
		                    '<td class="dStat">' + data.data[3][0].HomeDPSE + '%</td>' +
		                    '<td class="dStat">' + data.data[3][0].HomeFBSE + '%</td>' +
		                    '<td class="dStat">' + data.data[3][0].HomeDTE + '%</td>' +
		                    '<td class="oStat">' + data.data[3][0].HomeThrows + '</td>' +
		                    '<td class="oStat">' + data.data[3][0].HomeCompPerc + '%</td>' +
		                    '<td class="oStat">' + data.data[3][0].HomeBlocks + '</td>' +
		                    '<td class="oStat">' + data.data[3][0].HomeTurnovers + '</td>' +
		                    '<td class="oStat">' + data.data[3][0].HomeFouls + '</td>' +
		                '</tr>' +
		            '</tbody>' +
		        '</table>' +
		        '<div class="overlay-bg">' +
				'</div>' +
				'<div class="overlay-content popup1">' +
					'<h2>Term Glossary</h2>' +
				    '<p><strong>TPOP</strong> – Total touches per offensive possession for the entire team.</br><strong> Br – Breaks</strong> – Total number of breaks recorded by the team OR goals scored by a team that started a point on defense.</br><strong>Hd – Holds</strong> – Total number of holds recorded by the team OR goals scored by a team that started the point on offense.</br><strong>TSE – Total scoring efficiency</strong> – Percentage of the time that the team scored on a given possession, regardless of hold/break opportunity.</br><strong>HPSE – Hold possession scoring efficiency</strong> – Percentage of the time that the team scored a given hold opportunity.</br><strong>BPSE – Break possession scoring efficiency</strong> – Percentage of the time that the team scored a given break opportunity.</br><strong>OSE – Offensive scoring efficiency</strong> – Percentage of the time that the team scored during a point that they began on offense.</br><strong>FHSE – First hold scoring efficiency</strong> – Percentage of the time that the team scored their first hold opportunity.</br><strong>DSE – Defensive scoring efficiency</strong> – Percentage of the time that the team scored during a point that they began on defense.</br><strong>FBSE – First break scoring efficiency</strong> – Percentage of the time that the team scored their first break opportunity.</br><strong>DTE – Defensive turnover efficiency</strong> – Percentage of the time that the team forced a turnover on their first defensive possession.</br><strong>Thr – Throws</strong> – Total number of attempted throws by the entire team.</br><strong>COMP% – Completion Percentage</strong> – Total number of completed throws over total number of attempted throws.</br><strong>B – Blocks</strong> – Total number of defensive blocks recorded by entire team.</br><strong>T – Turnovers</strong> – Total number of turnovers committed by entire team.</br><strong>F – Fouls</strong> – Total number of fouls committed by entire team.</p>' +
				    '<button class="close-btn">Close</button>' +
				'</div>' +
			'</div>';
			$('#boxScoreBoxSummary').html(summary); var statbox =
			'<div id="bs-statbox-home">' +
			    '<div id="tabs" class="tabs">' +
			    	'<ul class="tab-links">' +
			    		'<li class="active1"><a href="#tab1">Overview</a></li>' +
			    		'<li><a href="#tab2">Percentages</a></li>' +
			    		'<li><a href="#tab3">Fouls/Turns</a></li>' +
			    		'<li><a href="#tab4">Miscellaneous</a></li>' +
			    	'</ul>' +
		    		'<div class="tab-content">' +
					    '<div id="tab1" class="tab active1">' +
					    	'<p class="bs-team-name">' + data.data[0][0].HomeTeamCity + ' ' + data.data[0][0].HomeTeam + '</p>' +
					        '<table id="bs-statbox-home-stats-basic" class="tablesorter">' +
					            '<thead>' +
					                '<tr>' +
					                    '<th class="bs-statbox-player-name">Player</th>' +
					                    '<th title="Goals">G</th>' +
					                    '<th title="Assists">A</th>' +
					                    '<th title="Blocks">B</th>' +
					                    '<th class="hideSmall" title="Points Played">PP</th>' +
					                    '<th title="Completions">COMP</th>' +
					                    '<th class="hideSmall" title="Throws">THR</th>' +
					                    '<th class="hideSmall" title="Completion Percentage">COMP%</th>' +
					                    '<th title="Turnovers">T</th>' +
					                '</tr>' +
					            '</thead>' +
					            '<tbody>';
						            for (var i = 0; i < data.data[5].length; i++) { statbox += 
						            	'<tr>' +
						                    '<td><a id="pid' + data.data[5][i].PlayerID + '" class="playerHighlight" href="http://mlultimate.com/player/?pid=' + data.data[5][i].PlayerID + '">' + data.data[5][i].Player + '</a> <input type="checkbox" name="playerHighlightHome" value="pid' + data.data[5][i].PlayerID + '" class="playerHighlightRadioHome">'; if (data.data[5][i].Bands > 0) {statbox += '<div class="bandBox"></div>';}; statbox += '</td>' +
						                    '<td>' + data.data[5][i].Goals + '</td>' +
						                    '<td>' + data.data[5][i].Assists + '</td>' +
						                    '<td>' + data.data[5][i].Blocks + '</td>' +
						                    '<td class="hideSmall">' + data.data[5][i].PointsPlayed + '</td>' +
						                    '<td>' + data.data[5][i].Completions + '</td>' +
						                    '<td class="hideSmall">' + data.data[5][i].Throws + '</td>' +
						                    '<td class="hideSmall">' + data.data[5][i].CompPerc + '%</td>' +
						                    '<td>' + data.data[5][i].Turnovers + '</td>' +
						                '</tr>';
						            }; statbox += 
						        '</tbody>' +
					        '</table>' +
					        '</br></br></br></br>' +
					        '<p class="bs-team-name">' + data.data[0][0].AwayTeamCity + ' ' + data.data[0][0].AwayTeam + '</p>' +
					        '<table id="bs-statbox-away-stats-basic" class="tablesorter">' +
					            '<thead>' +
					                '<tr>' +
					                    '<th class="bs-statbox-player-name">Player</th>' +
					                    '<th title="Goals">G</th>' +
					                    '<th title="Assists">A</th>' +
					                    '<th title="Blocks">B</th>' +
					                    '<th class="hideSmall" title="Points Played">PP</th>' +
					                    '<th title="Completions">COMP</th>' +
					                    '<th class="hideSmall" title="Throws">THR</th>' +
					                    '<th class="hideSmall" title="Completion Percentage">COMP%</th>' +
					                    '<th title="Turnovers">T</th>' +
					                '</tr>' +
					            '</thead>' +
					            '<tbody>';
						            for (var i = 0; i < data.data[6].length; i++) { statbox += 
						            	'<tr>' +
						                    '<td><a id="pid' + data.data[6][i].PlayerID + '" class="playerHighlight" href="http://mlultimate.com/player/?pid=' + data.data[6][i].PlayerID + '">' + data.data[6][i].Player + '</a> <input type="checkbox" name="playerHighlightAway" value="pid' + data.data[6][i].PlayerID + '" class="playerHighlightRadioAway">'; if (data.data[6][i].Bands > 0) {statbox += '<div class="bandBox"></div>';}; statbox += '</td>' +
						                    '<td>' + data.data[6][i].Goals + '</td>' +
						                    '<td>' + data.data[6][i].Assists + '</td>' +
						                    '<td>' + data.data[6][i].Blocks + '</td>' +
						                    '<td class="hideSmall">' + data.data[6][i].PointsPlayed + '</td>' +
						                    '<td>' + data.data[6][i].Completions + '</td>' +
						                    '<td class="hideSmall">' + data.data[6][i].Throws + '</td>' +
						                    '<td class="hideSmall">' + data.data[6][i].CompPerc + '%</td>' +
						                    '<td>' + data.data[6][i].Turnovers + '</td>' +
						                '</tr>';
						            }; statbox += 
						        '</tbody>' +
					        '</table>' +
					    '</div>' +
					    '<div id="tab2" class="tab">' +
					    	'<p class="bs-team-name">' + data.data[0][0].HomeTeamCity + ' ' + data.data[0][0].HomeTeam + '</p>' +
					        '<table id="bs-statbox-home-stats-percentage" class="tablesorter">' +
					            '<thead>' +
					                '<tr>' +
					                    '<th class="bs-statbox-player-name">Player</th>' +
					                    '<th class="hideSmall" title="Completion Percentage">COMP%</th>' +
					                    '<th title="Offensive Scoring Efficiency">OSE</th>' +
					                    '<th title="Defensive Scoring Efficiency">DSE</th>' +
					                    '<th title="Defensive Turnover Efficiency">DTE</th>' +
					                    '<th class="hideSmall" title="First Break Scoring Efficiency">FBSE</th>' +
					                    '<th title="Touches per Offensive Possession">TPOP</th>' +
					                '</tr>' +
					            '</thead>' +
					            '<tbody>';
						            for (var i = 0; i < data.data[5].length; i++) { statbox += 
						            	'<tr>' +
						                    '<td><a id="pid' + data.data[5][i].PlayerID + '" class="playerHighlight" href="http://mlultimate.com/player/?pid=' + data.data[5][i].PlayerID + '">' + data.data[5][i].Player + '</a> <input type="checkbox" name="playerHighlightHome" value="pid' + data.data[5][i].PlayerID + '" class="playerHighlightRadioHome">'; if (data.data[5][i].Bands > 0) {statbox += '<div class="bandBox"></div>';}; statbox += '</td>' +
						                    '<td class="hideSmall">' + data.data[5][i].CompPerc + '%</td>' +
						                    '<td>' + data.data[5][i].OSE + '%</td>' +
						                    '<td>' + data.data[5][i].DSE + '%</td>' +
						                    '<td>' + data.data[5][i].DTE + '%</td>' +
						                    '<td class="hideSmall">' + data.data[5][i].FBSE + '%</td>' +
						                    '<td>' + data.data[5][i].TPOP + '</td>' +
						                '</tr>';
						            }; statbox += 
					            '</tbody>' +
					        '</table>' +
					        '</br></br></br></br>' +
					        '<p class="bs-team-name">' + data.data[0][0].AwayTeamCity + ' ' + data.data[0][0].AwayTeam + '</p>' +
					        '<table id="bs-statbox-away-stats-percentage" class="tablesorter">' +
					            '<thead>' +
					                '<tr>' +
					                    '<th class="bs-statbox-player-name">Player</th>' +
					                    '<th class="hideSmall" title="Completion Percentage">COMP%</th>' +
					                    '<th title="Offensive Scoring Efficiency">OSE</th>' +
					                    '<th title="Defensive Scoring Efficiency">DSE</th>' +
					                    '<th title="Defensive Turnover Efficiency">DTE</th>' +
					                    '<th class="hideSmall" title="First Break Scoring Efficiency">FBSE</th>' +
					                    '<th title="Touches per Offensive Possession">TPOP</th>' +
					                '</tr>' +
					            '</thead>' +
					            '<tbody>';
						            for (var i = 0; i < data.data[6].length; i++) { statbox +=
						            	'<tr>' +
						                    '<td><a id="pid' + data.data[6][i].PlayerID + '" class="playerHighlight" href="http://mlultimate.com/player/?pid=' + data.data[6][i].PlayerID + '">' + data.data[6][i].Player + '</a> <input type="checkbox" name="playerHighlightAway" value="pid' + data.data[6][i].PlayerID + '" class="playerHighlightRadioAway">'; if (data.data[6][i].Bands > 0) {statbox += '<div class="bandBox"></div>';}; statbox += '</td>' +
						                    '<td class="hideSmall">' + data.data[6][i].CompPerc + '%</td>' +
						                    '<td>' + data.data[6][i].OSE + '%</td>' +
						                    '<td>' + data.data[6][i].DSE + '%</td>' +
						                    '<td>' + data.data[6][i].DTE + '%</td>' +
						                    '<td class="hideSmall">' + data.data[6][i].FBSE + '%</td>' +
						                    '<td>' + data.data[6][i].TPOP + '</td>' +
						                '</tr>';
						            }; statbox +=
						        '</tbody>' +
					        '</table>' +
					    '</div>' +
					    '<div id="tab3" class="tab">' +
					    	'<p class="bs-team-name">' + data.data[0][0].HomeTeamCity + ' ' + data.data[0][0].HomeTeam + '</p>' +
					        '<table id="bs-statbox-home-stats-advanced" class="tablesorter">' +
					            '<thead>' +
					                '<tr>' +
					                	'<th class="bs-statbox-player-name">Player</th>' +
					                    '<th title="Turnovers">T</th>' +
					                    '<th title="Fouls">F</th>' +
					                    '<th title="Travels">Tr</th>' +
					                    '<th title="Stalls">St</th>' +
					                    '<th title="Throwaways">TA</th>' +
					                    '<th class="hideSmall" title="Throws into Blocks">TiB</th>' +
					                    '<th title="Drops">D</th>' +
					                '</tr>' +
					            '</thead>' +
					            '<tbody>';
						            for (var i = 0; i < data.data[5].length; i++) { statbox +=
						            	'<tr>' +
						                    '<td><a id="pid' + data.data[5][i].PlayerID + '" class="playerHighlight" href="http://mlultimate.com/player/?pid=' + data.data[5][i].PlayerID + '">' + data.data[5][i].Player + '</a> <input type="checkbox" name="playerHighlightHome" value="pid' + data.data[5][i].PlayerID + '" class="playerHighlightRadioHome">'; if (data.data[5][i].Bands > 0) {statbox += '<div class="bandBox"></div>';}; statbox += '</td>' +
						                    '<td>' + data.data[5][i].Turnovers + '</td>' +
						                    '<td>' + data.data[5][i].Fouls + '</td>' +
						                    '<td>' + data.data[5][i].Travels + '</td>' +
						                    '<td>' + data.data[5][i].Stalls + '</td>' +
						                    '<td>' + data.data[5][i].Throwaways + '</td>' +
						                    '<td class="hideSmall">' + data.data[5][i].ThrowIntoBlocks + '</td>' +
						                    '<td>' + data.data[5][i].Drops + '</td>' +
						                '</tr>';
						            }; statbox += 
						        '</tbody>' +
					        '</table>' +
							'</br></br></br></br>' +
					        '<p class="bs-team-name">' + data.data[0][0].AwayTeamCity + ' ' + data.data[0][0].AwayTeam + '</p>' +
					        '<table id="bs-statbox-away-stats-advanced" class="tablesorter">' +
					            '<thead>' +
					                '<tr>' +
					                	'<th class="bs-statbox-player-name">Player</th>' +
					                    '<th title="Turnovers">T</th>' +
					                    '<th title="Fouls">F</th>' +
					                    '<th title="Travels">Tr</th>' +
					                    '<th title="Stalls">St</th>' +
					                    '<th title="Throwaways">TA</th>' +
					                    '<th class="hideSmall" title="Throws into Blocks">TiB</th>' +
					                    '<th title="Drops">D</th>' +
					                '</tr>' +
					            '</thead>' +
					            '<tbody>';
						            for (var i = 0; i < data.data[6].length; i++) { statbox +=
						            	'<tr>' +
						                    '<td><a id="pid' + data.data[6][i].PlayerID + '" class="playerHighlight" href="http://mlultimate.com/player/?pid=' + data.data[6][i].PlayerID + '">' + data.data[6][i].Player + '</a> <input type="checkbox" name="playerHighlightAway" value="pid' + data.data[6][i].PlayerID + '" class="playerHighlightRadioAway">'; if (data.data[6][i].Bands > 0) {statbox += '<div class="bandBox"></div>';}; statbox += '</td>' +
						                    '<td>' + data.data[6][i].Turnovers + '</td>' +
						                    '<td>' + data.data[6][i].Fouls + '</td>' +
						                    '<td>' + data.data[6][i].Travels + '</td>' +
						                    '<td>' + data.data[6][i].Stalls + '</td>' +
						                    '<td>' + data.data[6][i].Throwaways + '</td>' +
						                    '<td class="hideSmall">' + data.data[6][i].ThrowIntoBlocks + '</td>' +
						                    '<td>' + data.data[6][i].Drops + '</td>' +
						                '</tr>';
						            }; statbox += 
					            '</tbody>' +
					        '</table>' +
					    '</div>' +
					    '<div id="tab4" class="tab">' +
					    	'<p class="bs-team-name">' + data.data[0][0].HomeTeamCity + ' ' + data.data[0][0].HomeTeam + '</p>' +
					        '<table id="bs-statbox-home-stats-extra" class="tablesorter">' +
					            '<thead>' +
					                '<tr>' +
					                    '<th class="bs-statbox-player-name">Player</th>' +
					                    '<th title="Catches">C</th>' +
					                    '<th class="hideSmall" title="Bookends">BE</th>' +
					                    '<th class="hideSmall" title="Callahans">Call</th>' +
					                    '<th title="Offensive Points Played">O-PP</th>' +
					                    '<th title="Defensive Points Played">D-PP</th>' +
					                    '<th title="Hockey Assists">HA</th>' +
					                '</tr>' +
					            '</thead>' +
					            '<tbody>';
						            for (var i = 0; i < data.data[5].length; i++) { statbox +=
						            	'<tr>' +
						                    '<td><a id="pid' + data.data[5][i].PlayerID + '" class="playerHighlight" href="http://mlultimate.com/player/?pid=' + data.data[5][i].PlayerID + '">' + data.data[5][i].Player + '</a> <input type="checkbox" name="playerHighlightHome" value="pid' + data.data[5][i].PlayerID + '" class="playerHighlightRadioHome">'; if (data.data[5][i].Bands > 0) {statbox += '<div class="bandBox"></div>';}; statbox += '</td>' +
						                    '<td>' + data.data[5][i].Catches + '</td>' +
						                    '<td class="hideSmall">' + data.data[5][i].Bookends + '</td>' +
						                    '<td class="hideSmall">' + data.data[5][i].Callahans + '</td>' +
						                    '<td>' + data.data[5][i].OPointsPlayed + '</td>' +
						                    '<td>' + data.data[5][i].DPointsPlayed + '</td>' +
						                    '<td>' + data.data[5][i].HockeyAssists + '</td>' +
						                '</tr>';
						            }; statbox +=
					            '</tbody>' +
					        '</table>' +
					        '</br></br></br></br>' +
					        '<p class="bs-team-name">' + data.data[0][0].AwayTeamCity + ' ' + data.data[0][0].AwayTeam + '</p>' +
					        '<table id="bs-statbox-away-stats-extra" class="tablesorter">' +
					            '<thead>' +
					                '<tr>' +
					                    '<th class="bs-statbox-player-name">Player</th>' +
					                    '<th title="Catches">C</th>' +
					                    '<th class="hideSmall" title="Bookends">BE</th>' +
					                    '<th class="hideSmall" title="Callahans">Call</th>' +
					                    '<th title="Offensive Points Played">O-PP</th>' +
					                    '<th title="Defensive Points Played">D-PP</th>' +
					                    '<th title="Hockey Assists">HA</th>' +
					                '</tr>' +
					            '</thead>' +
					            '<tbody>';
						            for (var i = 0; i < data.data[6].length; i++) { statbox +=
						            	'<tr>' +
						                    '<td><a id="pid' + data.data[6][i].PlayerID + '" class="playerHighlight" href="http://mlultimate.com/player/?pid=' + data.data[6][i].PlayerID + '">' + data.data[6][i].Player + '</a> <input type="checkbox" name="playerHighlightAway" value="pid' + data.data[6][i].PlayerID + '" class="playerHighlightRadioAway">'; if (data.data[6][i].Bands > 0) {statbox += '<div class="bandBox"></div>';}; statbox += '</td>' +
						                    '<td>' + data.data[6][i].Catches + '</td>' +
						                    '<td class="hideSmall">' + data.data[6][i].Bookends + '</td>' +
						                    '<td class="hideSmall">' + data.data[6][i].Callahans + '</td>' +
						                    '<td>' + data.data[6][i].OPointsPlayed + '</td>' +
						                    '<td>' + data.data[6][i].DPointsPlayed + '</td>' +
						                    '<td>' + data.data[6][i].HockeyAssists + '</td>' +
						                '</tr>';
						            }; statbox +=
						        '</tbody>' +
					        '</table>' +
					    '</div>' +
					'</div>' +
				'</div>' +
			'</div>'; 
			var dataViz = 
				'<h2 class="timelineHeader">Game Timeline</h2>' +
		        '<div class="timelineQuarter odd" id="quarterOneTimeline">' +
		            '<h2 class="quarterHeader">Q1</h2>' +
		            '<div id="quarterInfo">' +
			            '<div id="homeGoalDiv1" class="picHolder">';
				            var j = 0;
					        for (var i = 0; i < (data.data[1][0].Home1 + data.data[2][0].Away1); i++) {
					            if ((data.data[8][i].Quarter == 1) && (data.data[8][i].TeamID == data.data[1][0].HomeTeamID)) {
					                var time = data.data[8][i].Time;
					                var minutes = (Math.floor(time/60));
					                var seconds = time - minutes * 60;
					                function str_pad_left(string,pad,length) {return (new Array(length+1).join(pad)+string).slice(-length);}
					                var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
					                dataViz += '<div id="goal' + (i+1) + '" class="picGoal"><img title="Time of Goal: ' + finalTime + '</br><p>Thrown By: ' + data.data[8][i].AssistPlayerName + '</br>Caught By: ' + data.data[8][i].GoalPlayerName + '</p>" class="pid' + data.data[8][i].GoalPlayerID + 'Goal pid' + data.data[8][i].AssistPlayerID + 'Assist timelineImg" src="http:';
					                    if (data.data[8][i].HoldBreak == 1) { dataViz +=
					                    	data.data[10][0].HomeHomeBreak;
					                    } else { dataViz +=
					                    	data.data[10][0].HomeHomeHold;
					                    }; dataViz +=
					                '" style="position: relative; left: ' + (((data.data[8][i].Time * 100) / 600) - 2) + '%;"></div>';
					            };
					        }; dataViz +=
					    '</div>' +
					    '<div class="picGoal hrer"><hr></div>' +
					    '<div id="awayGoalDiv1" class="picHolder">';
					        for (var i = 0; i < (data.data[1][0].Home1 + data.data[2][0].Away1); i++) {
					            if ((data.data[8][i].Quarter == 1) && (data.data[8][i].TeamID == data.data[2][0].AwayTeamID)) {
					                var time = data.data[8][i].Time;
					                var minutes = (Math.floor(time/60));
					                var seconds = time - minutes * 60;
					                function str_pad_left(string,pad,length) {return (new Array(length+1).join(pad)+string).slice(-length);}
					                var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
					                dataViz += '<div id="goal' + (i+1) + '" class="picGoal"><img title="Time of Goal: ' + finalTime + '</br><p>Thrown By: ' + data.data[8][i].AssistPlayerName + '</br>Caught By: ' + data.data[8][i].GoalPlayerName + '</p>" class="pid' + data.data[8][i].GoalPlayerID + 'Goal pid' + data.data[8][i].AssistPlayerID + 'Assist timelineImg" src="http:';
					                    if (data.data[8][i].HoldBreak == 1) { dataViz +=
					                    	data.data[11][0].AwayAwayBreak;
					                    } else { dataViz +=
					                    	data.data[11][0].AwayAwayHold;
					                    }; dataViz +=
					                '" style="position: relative; left: ' + (((data.data[8][i].Time * 100) / 600) - 2) + '%;"></div>';
					            };
					        }; j += (data.data[1][0].Home1 + data.data[2][0].Away1); dataViz +=
					    '</div>' +
					'</div>' +
				'</div>' +
				'<div class="timelineQuarter even" id="quarterTwoTimeline">' +
		            '<h2 class="quarterHeader">Q2</h2>' +
		            '<div id="quarterInfo">' +
			            '<div id="homeGoalDiv2" class="picHolder">';
					        for (var i = j; i < (data.data[1][0].Home2 + data.data[2][0].Away2 + j); i++) {
					            if ((data.data[8][i].Quarter == 2) && (data.data[8][i].TeamID == data.data[1][0].HomeTeamID)) {
					                var time = data.data[8][i].Time;
					                var minutes = (Math.floor(time/60));
					                var seconds = time - minutes * 60;
					                function str_pad_left(string,pad,length) {return (new Array(length+1).join(pad)+string).slice(-length);}
					                var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
					                dataViz += '<div id="goal' + (i+1) + '" class="picGoal"><img title="Time of Goal: ' + finalTime + '</br><p>Thrown By: ' + data.data[8][i].AssistPlayerName + '</br>Caught By: ' + data.data[8][i].GoalPlayerName + '</p>" class="pid' + data.data[8][i].GoalPlayerID + 'Goal pid' + data.data[8][i].AssistPlayerID + 'Assist timelineImg" src="http:';
					                    if (data.data[8][i].HoldBreak == 1) { dataViz +=
					                    	data.data[10][0].HomeHomeBreak;
					                    } else {  dataViz +=
					                    	data.data[10][0].HomeHomeHold;
					                    }; dataViz +=
					                '" style="position: relative; left: ' + (((data.data[8][i].Time * 100) / 600) - 2) + '%;"></div>';
					            };
					        };  dataViz +=
					    '</div>' +
					    '<div class="picGoal hrer"><hr></div>' +
					    '<div id="awayGoalDiv2" class="picHolder">';
					        for (var i = j; i < (data.data[1][0].Home2 + data.data[2][0].Away2 + j); i++) {
					            if ((data.data[8][i].Quarter == 2) && (data.data[8][i].TeamID == data.data[2][0].AwayTeamID)) {
					                var time = data.data[8][i].Time;
					                var minutes = (Math.floor(time/60));
					                var seconds = time - minutes * 60;
					                function str_pad_left(string,pad,length) {return (new Array(length+1).join(pad)+string).slice(-length);}
					                var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
					                dataViz += '<div id="goal' + (i+1) + '" class="picGoal"><img title="Time of Goal: ' + finalTime + '</br><p>Thrown By: ' + data.data[8][i].AssistPlayerName + '</br>Caught By: ' + data.data[8][i].GoalPlayerName + '</p>" class="pid' + data.data[8][i].GoalPlayerID + 'Goal pid' + data.data[8][i].AssistPlayerID + 'Assist timelineImg" src="http:';
					                    if (data.data[8][i].HoldBreak == 1) { dataViz +=
					                    	data.data[11][0].AwayAwayBreak;
					                    } else { dataViz +=
					                    	data.data[11][0].AwayAwayHold;
					                    }; dataViz +=
					                '" style="position: relative; left: ' + (((data.data[8][i].Time * 100) / 600) - 2) + '%;"></div>';
					            };
					        }; j += (data.data[1][0].Home2 + data.data[2][0].Away2); dataViz +=
					    '</div>' +
					'</div>' +
				'</div>' +
				'<div class="timelineQuarter odd" id="quarterThreeTimeline">' +
		            '<h2 class="quarterHeader">Q3</h2>' +
		            '<div id="quarterInfo">' +
		            	'<div id="homeGoalDiv3" class="picHolder">';
					        for (var i = j; i < (data.data[1][0].Home3 + data.data[2][0].Away3 + j); i++) {
					            if ((data.data[8][i].Quarter == 3) && (data.data[8][i].TeamID == data.data[1][0].HomeTeamID)) {
					                var time = data.data[8][i].Time;
					                var minutes = (Math.floor(time/60));
					                var seconds = time - minutes * 60;
					                function str_pad_left(string,pad,length) {return (new Array(length+1).join(pad)+string).slice(-length);}
					                var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
					                dataViz += '<div id="goal' + (i+1) + '" class="picGoal"><img title="Time of Goal: ' + finalTime + '</br><p>Thrown By: ' + data.data[8][i].AssistPlayerName + '</br>Caught By: ' + data.data[8][i].GoalPlayerName + '</p>" class="pid' + data.data[8][i].GoalPlayerID + 'Goal pid' + data.data[8][i].AssistPlayerID + 'Assist timelineImg" src="http:';
					                    if (data.data[8][i].HoldBreak == 1) { dataViz +=
					                    	data.data[10][0].HomeHomeBreak;
					                    } else { dataViz +=
					                    	data.data[10][0].HomeHomeHold;
					                    }; dataViz += 
					                '" style="position: relative; left: ' + (((data.data[8][i].Time * 100) / 600) - 2) + '%;"></div>';
					            };
					        }; dataViz +=
					    '</div>' +
					    '<div class="picGoal hrer"><hr></div>' +
					    '<div id="awayGoalDiv3" class="picHolder">';
					        for (var i = j; i < (data.data[1][0].Home3 + data.data[2][0].Away3 + j); i++) {
					            if ((data.data[8][i].Quarter == 3) && (data.data[8][i].TeamID == data.data[2][0].AwayTeamID)) {
					                var time = data.data[8][i].Time;
					                var minutes = (Math.floor(time/60));
					                var seconds = time - minutes * 60;
					                function str_pad_left(string,pad,length) {return (new Array(length+1).join(pad)+string).slice(-length);}
					                var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
					                dataViz += '<div id="goal' + (i+1) + '" class="picGoal"><img title="Time of Goal: ' + finalTime + '</br><p>Thrown By: ' + data.data[8][i].AssistPlayerName + '</br>Caught By: ' + data.data[8][i].GoalPlayerName + '</p>" class="pid' + data.data[8][i].GoalPlayerID + 'Goal pid' + data.data[8][i].AssistPlayerID + 'Assist timelineImg" src="http:';
					                    if (data.data[8][i].HoldBreak == 1) { dataViz +=
					                    	data.data[11][0].AwayAwayBreak;
					                    } else { dataViz +=
					                    	data.data[11][0].AwayAwayHold;
					                    }; dataViz +=
					                '" style="position: relative; left: ' + (((data.data[8][i].Time * 100) / 600) - 2) + '%;"></div>';
					            };
					        }; j += (data.data[1][0].Home3 + data.data[2][0].Away3); dataViz +=
					    '</div>' +
					'</div>' +
				'</div>' +
				'<div class="timelineQuarter even" id="quarterFourTimeline">' +
		            '<h2 class="quarterHeader">Q4</h2>' +
		            '<div id="quarterInfo">' +
			            '<div id="homeGoalDiv4" class="picHolder">';
					        for (var i = j; i < (data.data[1][0].Home4 + data.data[2][0].Away4 + j); i++) {
					            if ((data.data[8][i].Quarter == 4) && (data.data[8][i].TeamID == data.data[1][0].HomeTeamID)) {
					                var time = data.data[8][i].Time;
					                var minutes = (Math.floor(time/60));
					                var seconds = time - minutes * 60;
					                function str_pad_left(string,pad,length) {return (new Array(length+1).join(pad)+string).slice(-length);}
					                var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
					                dataViz += '<div id="goal' + (i+1) + '" class="picGoal"><img title="Time of Goal: ' + finalTime + '</br><p>Thrown By: ' + data.data[8][i].AssistPlayerName + '</br>Caught By: ' + data.data[8][i].GoalPlayerName + '</p>" class="pid' + data.data[8][i].GoalPlayerID + 'Goal pid' + data.data[8][i].AssistPlayerID + 'Assist timelineImg" src="http:';
					                    if (data.data[8][i].HoldBreak == 1) { dataViz +=
					                    	data.data[10][0].HomeHomeBreak;
					                    } else { dataViz +=
					                    	data.data[10][0].HomeHomeHold;
					                    }; dataViz +=
					                '" style="position: relative; left: ' + (((data.data[8][i].Time * 100) / 600) - 2) + '%;"></div>';
					            };
					        }; dataViz +=
					    '</div>' +
					    '<div class="picGoal hrer"><hr></div>' +
					    '<div id="awayGoalDiv4" class="picHolder">';
					        for (var i = j; i < (data.data[1][0].Home4 + data.data[2][0].Away4 + j); i++) {
					            if ((data.data[8][i].Quarter == 4) && (data.data[8][i].TeamID == data.data[2][0].AwayTeamID)) {
					                var time = data.data[8][i].Time;
					                var minutes = (Math.floor(time/60));
					                var seconds = time - minutes * 60;
					                function str_pad_left(string,pad,length) {return (new Array(length+1).join(pad)+string).slice(-length);}
					                var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
					                dataViz += '<div id="goal' + (i+1) + '" class="picGoal"><img title="Time of Goal: ' + finalTime + '</br><p>Thrown By: ' + data.data[8][i].AssistPlayerName + '</br>Caught By: ' + data.data[8][i].GoalPlayerName + '</p>" class="pid' + data.data[8][i].GoalPlayerID + 'Goal pid' + data.data[8][i].AssistPlayerID + 'Assist timelineImg" src="http:';
					                    if (data.data[8][i].HoldBreak == 1) {  dataViz +=
					                    	data.data[11][0].AwayAwayBreak;
					                    } else { dataViz +=
					                    	data.data[11][0].AwayAwayHold;
					                    }; dataViz += 
					                '" style="position: relative; left: ' + (((data.data[8][i].Time * 100) / 600) - 2) + '%;"></div>';
					                $(".pid" + data.data[8][i].GoalPlayerID + "Goal").tooltip({
					                    content: function () {
					                        return $(this).prop('title' + i);
					                    }
					                });
					            };
					        }; dataViz +=
					    '</div>' +
					'</div>' +
				'</div>';
		        if ((data.data[1][0].HomeOT) > 0 || (data.data[2][0].AwayOT) > 0) { dataViz +=
		        	'<div class="timelineQuarter odd" id="quarterFiveTimeline">' +
		                '<h2 class="quarterHeader">OT</h2>' +
		                '<div id="quarterInfo">' +
		                	'<div id="homeGoalDiv5" class="picHolder">';
			                    for (var i = 0; i < data.data[9].length; i++) {
			                        if ((data.data[9][i].Quarter == 5) && (data.data[9][i].TeamID == data.data[1][0].HomeTeamID)) {
			                            var time = data.data[9][i].Time;
			                            var minutes = (Math.floor(time/60));
			                            var seconds = time - minutes * 60;
			                            function str_pad_left(string,pad,length) {return (new Array(length+1).join(pad)+string).slice(-length);}
			                            var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
			                            dataViz += '<div id="goal' + (i+1) + '" class="picGoal"><img title="Time of Goal: ' + finalTime + '</br><p>Thrown By: ' + data.data[9][i].AssistPlayerName + '</br>Caught By: ' + data.data[9][i].GoalPlayerName + '</p>" class="pid' + data.data[9][i].GoalPlayerID + 'Goal pid' + data.data[9][i].AssistPlayerID + 'Assist timelineImg" src="http:';
			                                if (data.data[9][i].HoldBreak == 1) { dataViz +=
			                                	data.data[10][0].HomeHomeBreak;
			                                } else { dataViz +=
			                                	data.data[10][0].HomeHomeHold;
			                                }; dataViz +=
			                            '" style="position: relative; left: ' + (((data.data[9][i].Time * 100) / 600) - 2) + '%;"></div>';
			                        };
			                    }; dataViz +=
			                '</div>' +
			                '<hr id="overtimeHR">' +
			                '<div id="awayGoalDiv5" class="picHolder">';
			                    for (var i = 0; i < data.data[9].length; i++) {
			                        if ((data.data[9][i].Quarter == 5) && (data.data[9][i].TeamID == data.data[2][0].AwayTeamID)) {
			                            var time = data.data[9][i].Time;
			                            var minutes = (Math.floor(time/60));
			                            var seconds = time - minutes * 60;
			                            function str_pad_left(string,pad,length) {return (new Array(length+1).join(pad)+string).slice(-length);}
			                            var finalTime = str_pad_left(minutes,'0',2)+':'+str_pad_left(seconds,'0',2);
			                            dataViz += '<div id="goal' + (i+1) + '" class="picGoal"><img title="Time of Goal: ' + finalTime + '</br><p>Thrown By: ' + data.data[9][i].AssistPlayerName + '</br>Caught By: ' + data.data[9][i].GoalPlayerName + '</p>" class="pid' + data.data[9][i].GoalPlayerID + 'Goal pid' + data.data[9][i].AssistPlayerID + 'Assist timelineImg" src="http:';
			                                if (data.data[9][i].HoldBreak == 1) { dataViz +=
			                                	data.data[11][0].AwayAwayBreak;
			                                } else { dataViz +=
			                                	data.data[11][0].AwayAwayHold;
			                                }; dataViz +=
			                            '" style="position: relative; left: ' + (((data.data[9][i].Time * 100) / 600) - 2) + '%;"></div>';
			                            $(".pid" + data.data[9][i].GoalPlayerID + "Goal").tooltip({
			                                content: function () {
			                                    return $(this).prop('title' + i);
			                                }
			                            });
			                        };
			                    }; dataViz +=
			                '</div>' +
			            '</div>' +
			        '</div>';
		        }; dataViz +=
		        '<div><a class="show-popup" href="#" data-showpopup="2">Whats this? ^^^</a></div>' +
		        '<div class="overlay-content popup2">' +
		            '<h2>Timeline Glossary</h2>' +
		            '<p><img class="timelineGlossaryImg" src="http://mlultimate.com/wp-content/uploads/2015/09/Blank_Hold.png"> - When a team scores a hold (Goal scored by the team that started the point on offense)</br><img class="timelineGlossaryImg" src="http://mlultimate.com/wp-content/uploads/2015/09/Blank_Break.png"> - When a team scores a break (Goal scored by the team that started the point on defense)</br><img class="timelineGlossaryImg" src="http://mlultimate.com/wp-content/uploads/2015/09/Blank_Assist.png"> - Player threw the assist on the point</br><img class="timelineGlossaryImg" src="http://mlultimate.com/wp-content/uploads/2015/09/Blank_Goal.png"> - Player caught the goal on the point</p>' +
		            '<button class="close-btn">Close</button>' +
		        '</div>';
		    $('.sk-fading-circle').hide();
			$('#teamCompPerc').html('Team Completion Percentage');
			$('#data-vis').html(dataViz);
			$('#boxScoreBoxStatBox').html(statbox);
		};

		// Google DataViz Charts
		    google.charts.load('current', {packages: ['corechart']});
		    google.charts.setOnLoadCallback(drawChartTimeline);
			var drawChartTimeline = function(data) {
				var awayTeamChart = data.data[2][0].AwayTeamID;
				var homeTeamChart = data.data[1][0].HomeTeamID;
				var awayScoreChart = 0;
				var homeScoreChart = 0;
				var dataChart = [];
				var Header = ['Time', 'Away', 'Home'];
				var firstChartPoint = ['Q1 0:00', 0, 0];
				dataChart.push(Header);
				dataChart.push(firstChartPoint);
				for (var i = 0; i < data.data[8].length; i++) {
					var temp = [];
					var totalSec = data.data[8][i].Time;
					var minutes = parseInt( totalSec / 60 ) % 60;
					var seconds = totalSec % 60;
					var result = (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
		          	if (data.data[8][i].TeamID == awayTeamChart) {awayScoreChart++;};
		          	if (data.data[8][i].TeamID == homeTeamChart) {homeScoreChart++;};
		          	temp.push('Q' + data.data[8][i].Quarter + ' - ' + result);
		          	temp.push(awayScoreChart);
		          	temp.push(homeScoreChart);
		          	dataChart.push(temp);
		        };
		        var scoringTimeline = google.visualization.arrayToDataTable(dataChart);
		        var options = {
			        title: 'Timeline',
			        chartArea: {width:'100%',height:'100%'},
			        colors: [data.data[0][0].AwayTeamColor, data.data[0][0].HomeTeamColor],
		    	    legend: {position: 'none'},
		        	vAxis: {minValue: 0, gridlines: {count: 6}},
		        	width: 569,
		        	height: 400
		        };
			    var chart = new google.visualization.LineChart(document.getElementById('linechart_timeline'));
			    chart.draw(scoringTimeline, options);
			};
		// End Google DataViz Charts
	// End Creating True Boxscore

	// Creating Broken Boxscore
		var processDataBoxScoreBroken = function(data) { var head =
			'<div id="bs-container-wrapper">' +
				'<div id="bs-container">';
					if (data[0].Status == "In Progress") { head +=
						'<h1 class="timeDate">Q' + data[0].Quarter + ' - '; var clock = data[0].Time; if ((clock).slice(0,1) == "0") {head += (data[0].Time).slice(1,5)} else {head += data[0].Time}; head += '</h1>';
					} else { head +=
						'<h1 class="timeDate">' + data[0].ga_start_time + '</h1>';
					}; head +=
					'<div id="bs-top-container">' +
						'<div id="bs-away-top">' +
							'<div id="bs-away-team-top" class="bs-away-team bs-team-top" ><img class ="boxscore" src="http:' + data[0].AwayTeamPic + '"><h3 class="team-name"> ' + data[0].AwayTeamCity + ' ' + data[0].AwayTeam + '</h3><h7> ' + data[0].AwayRecord + '</h7></div>' +
							'<div id="bs-away-score-top" class="bs-away-team bs-score-top"><h1 class="bs-score">' + data[0].AwayFinal + '</h1></div>' +
							'<div id="bs-away-holds-top" class="bs-away-team bs-holds-top"><h2 class="bs-score">-</h2><h4>HOLDS</h4></div>' +
							'<div id="bs-away-breaks-top" class="bs-away-team bs-breaks-top"><h2 class="bs-score">-</h2><h4>BREAKS</h4></div>' +
						'</div>' +
						'<div id="bs-home-top">' +
							'<div id="bs-home-score-top" class="bs-home-team bs-score-top"><h1 class="bs-score">' + data[0].HomeFinal + '</h1></div>' +
							'<div id="bs-home-team-top" class="bs-home-team bs-team-top"><img class ="boxscore" src="http:' + data[0].HomeTeamPic + '"><h3 class="team-name"> ' + data[0].HomeTeamCity + ' ' + data[0].HomeTeam + '</h3><h7> ' + data[0].HomeRecord + '</h7></div>' +
							'<div id="bs-home-holds-top" class="bs-home-team bs-holds-top"><h2 class="bs-score">-</h2><h4>HOLDS</h4></div>' +
							'<div id="bs-home-breaks-top" class="bs-home-team bs-breaks-top"><h2 class="bs-score">-</h2><h4>BREAKS</h4></div>' +
						'</div>' +
						'<div id="bs-table-bottom">' +
							'<table id="bs-bottom">' +
								'<thead>' +
									'<tr>' +
										'<th></th>' +
										'<th>Q1</th>' +
										'<th>Q2</th>' +
										'<th>Q3</th>' +
										'<th>Q4</th>' +
										'<th>OT</th>' +
										'<th>F</th>' +
									'</tr>' +
								'</thead>' +
								'<tbody>' +
									'<tr>' +
										'<td class="team-name">' + data[0].HomeTeamShort + '</td>' +
										'<td>' + data[0].Home1 + '</td>' +
										'<td>' + data[0].Home2 + '</td>' +
										'<td>' + data[0].Home3 + '</td>' +
										'<td>' + data[0].Home4 + '</td>' +
										'<td>' + data[0].HomeOT + '</td>' +
										'<td>' + data[0].HomeFinal + '</td>' +
									'</tr>' +
									'<tr>' +
										'<td class="team-name">' + data[0].AwayTeamShort + '</td>' +
										'<td>' + data[0].Away1 + '</td>' +
										'<td>' + data[0].Away2 + '</td>' +
										'<td>' + data[0].Away3 + '</td>' +
										'<td>' + data[0].Away4 + '</td>' +
										'<td>' + data[0].AwayOT + '</td>' +
										'<td>' + data[0].AwayFinal + '</td>' +
									'</tr>' +
								'</tbody>' +
							'</table>' +
						'</div>' +
					'</div>' +
					'<div id="bs-info-bottom">' +
						'<div id="bs-weather-container">' +
							'<div id="location-text">' +
								'<h4>' + data[0].Location + '</h4>' +
							'</div>' +
							'<div id="weather-text">' +
								'<img src="http://mludev.staging.wpengine.com/wp-content/themes/valenti-child/library/images/weather-icon.png">  <h4>' + data[0].ga_weather + ' Degrees</h4>' +
							'</div>' +
							'<div id="wind-text">' +
								'<img src="http://mludev.staging.wpengine.com/wp-content/themes/valenti-child/library/images/wind-icon.png">  <h4>' + data[0].ga_wind + ' MPH</h4>' +
							'</div>' +
						'</div>' + 
					'</div>' +
				'</div>' +
			'</div>';
			$('.sk-fading-circle').hide();
			$('#extras').addClass('hidden');
			$('#bs-weather-container').addClass('centered');
			$('#boxScoreBoxHead').html(head);
		};
	// EndCreating Broken Boxscore

	// Creating Pregame Matchup
		var statTypeOne = 4;
		var statTypeOne = 7;
		var processMatchupInfo = function(data) { var matchupHead =
			'<h1 class="timeDate">Day - Month Date, Year Time TZ</h1>' +
			'<div class="mu-container">' +
				'<div class="mu-pickBox">' +
					'<div class="mu-teamHalf fleft">' +
						'<div class="mu-topTeamInfoLeft">' +
							'<div class="mu-imgDiv fleft"><img class="mu-teamLogo" src="http://mlultimate.com' + data[0][0].TeamPic + '">' +
							'<h3 class="mu-teamName">' + data[0][0].City + ' ' + data[0][0].Team + '</h3>' +
							'<h7>(W - L)</h7></div>' +
						'</div>' +
					'</div>' +
					'<div class="mu-recordDetails">' +
						'<div class="mu-teamRecord">' +
							'<strong>Head-to-Head Record:</strong></br> (# - #) Team </br>' +
							'<strong>Next Matchup:</strong></br> Month Date, Time @ Stadium' +
						'</div>' +
						'<div class="mu-teamRecordMiniBox">' +
							'<h2 class="mu-teamRecordNumber">(# - #)</h2>' +
							'<h4>HOME</h4>' +
						'</div>' +
						'<div class="mu-teamRecordMiniBox">' +
							'<h2 class="mu-teamRecordNumber">(# - #)</h2>' +
							'<h4>AWAY</h4>' +
						'</div>' +
						'<div class="mu-teamRecordMiniBox">' +
							'<h2 class="mu-teamRecordNumber">(# - #)</h2>' +
							'<h4>AWAY</h4>' +
						'</div>' +
						'<div class="mu-teamRecordMiniBox">' +
							'<h2 class="mu-teamRecordNumber">(# - #)</h2>' +
							'<h4>HOME</h4>' +
						'</div>' +
					'</div>' +
					'<div class="mu-teamHalf fright">' +
						'<div class="mu-topTeamInfoRight">' +
							'<div class="mu-imgDiv fright"><img class="mu-teamLogo" src="http://mlultimate.com' + data[1][0].TeamPic + '">' +
							'<h3 class="mu-teamName">' + data[1][0].City + ' ' + data[1][0].Team + '</h3>' +
							'<h7>(W - L)</h7></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';
		    $('.sk-fading-circle').hide();
			$('#boxScoreBoxHead').html(matchupHead);
		    $('.mu-compareInfoTop').show();
		    var matchupSummary =
				'<div class="mu-statTypeDiv">' +
					'<select class="mu-statTypePicker">' +
						'<option selected="selected" value="4">Head-to-Head</option>' +
						'<option value="2">Season</option>' +
						'<option value="3">All Time</option>' +
					'</select>' +
				'</div>' +
				'<div class="mu-teamCompareDiv">' +
					'<table>' +
						'<thead>' +
							'<tr>' +
								'<th>Team</th>' +
								'<th title="Wins">W</th>' +
								'<th title="Goals">G</th>' +
								'<th title="Blocks">B</th>' +
								'<th title="Completions">CMP</th>' +
								'<th title="Throws">THR</th>' +
								'<th title="Completion Percentage">CMP%</th>' +
								'<th title="Turnovers">T</th>' +
								'<th title="Drop">D</th>' +
								'<th title="Throws into Blocks">TiB</th>' +
								'<th title="Fouls">F</th>' +
							'</tr>' +
						'</thead>' +
						'<tbody>' +
							'<tr>' +
								'<td>' + data[4][0].Team + '</td>' +
								'<td> wins # </td>' + //' + data[4][0].Wins + '
								'<td>' + data[4][0].Goals + '</td>' +
								'<td>' + data[4][0].Blocks + '</td>' +
								'<td>' + data[4][0].Completions + '</td>' +
								'<td>' + data[4][0].ThrowsAttempted + '</td>' +
								'<td>' + data[4][0].CompPer + '%</td>' +
								'<td>' + data[4][0].Turnovers + '</td>' +
								'<td>' + data[4][0].Drops + '</td>' +
								'<td>' + data[4][0].ThrowIntoBlocks + '</td>' +
								'<td>' + data[4][0].Fouls + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td>' + data[7][0].Team + '</td>' +
								'<td> wins # </td>' + //' + data[7][0].Wins + '
								'<td>' + data[7][0].Goals + '</td>' +
								'<td>' + data[7][0].Blocks + '</td>' +
								'<td>' + data[7][0].Completions + '</td>' +
								'<td>' + data[7][0].ThrowsAttempted + '</td>' +
								'<td>' + data[7][0].CompPer + '%</td>' +
								'<td>' + data[7][0].Turnovers + '</td>' +
								'<td>' + data[7][0].Drops + '</td>' +
								'<td>' + data[7][0].ThrowIntoBlocks + '</td>' +
								'<td>' + data[7][0].Fouls + '</td>' +
							'</tr>' +
						'</tbody>' +
					'</table>' +
				'</div>';
			$('#boxScoreBoxSummary').html(matchupSummary);
		    $('.mu-statTypeDiv').show();
		    var matchupStatBox =
			    '<div class="mu-playersBox">' +
					'<div class="mu-teamOneDiv fleft">' +
						'<h2 class="mu-playersHeader">' + data[0][0].City + ' ' + data[0][0].Team + '</h2>' +
						'<table class="mu-playerTable tablesorter" style="width:100%;">' +
							'<thead>' +
								'<tr>' +
									'<th>Player</th>' +
									'<th title="Goals + Assists">G+A</th>' +
									'<th title="Goals">G</th>' +
									'<th title="Assists">A</th>' +
									'<th title="Blocks">B</th>' +
									'<th title="Completions">CMP</th>' +
									'<th title="Throws" class="hideSmall">THR</th>' +
									'<th title="Completion Percentage">CMP%</th>' +
									'<th title="Turnovers">T</th>' +
									'<th title="Offensive Points Played">OP</th>' +
									'<th title="Defensive Points Played">DP</th>' +
								'</tr>' +
							'</thead>' +
							'<tbody>';
								for (var i = 0; i < data[8].length; i++) { matchupStatBox +=
									'<tr>' +
										'<td><a href="http://mlultimate.com/player/?pid=' + data[8][i].PlayerID + '">' + data[8][i].Player + '</a></td>' +
										'<td>' + data[8][i].Points + '</td>' +
										'<td>' + data[8][i].Goals + '</td>' +
										'<td>' + data[8][i].Assists + '</td>' +
										'<td>' + data[8][i].Blocks + '</td>' +
										'<td>' + data[8][i].Completions + '</td>' +
										'<td class="hideSmall">' + data[8][i].ThrowsAttempted + '</td>';
										if (data[8][i].CompPer == null) {
											matchupStatBox += '<td>0.0%</td>';
										} else {
											matchupStatBox += '<td>' + data[8][i].CompPer + '%</td>';
										};
										matchupStatBox +=
										'<td>' + data[8][i].Turnovers + '</td>' +
										'<td>' + data[8][i].OPointsPlayed + '</td>' +
										'<td>' + data[8][i].DPointsPlayed + '</td>' +
									'</tr>';
								}; matchupStatBox += 
							'</tbody>' +
						'</table>' +
					'</div>' +
					'<div class="mu-teamTwoDiv fright">' +
						'<h2 class="mu-playersHeader">' + data[1][0].City + ' ' + data[1][0].Team + '</h2>' +
						'<table class="mu-playerTable tablesorter" style="width:100%;">' +
							'<thead>' +
								'<tr>' +
									'<th>Player</th>' +
									'<th title="Goals + Assists">G+A</th>' +
									'<th title="Goals">G</th>' +
									'<th title="Assists">A</th>' +
									'<th title="Blocks">B</th>' +
									'<th title="Completions">CMP</th>' +
									'<th title="Throws" class="hideSmall">THR</th>' +
									'<th title="Completion Percentage">CMP%</th>' +
									'<th title="Turnovers">T</th>' +
									'<th title="Offensive Points Played">OP</th>' +
									'<th title="Defensive Points Played">DP</th>' +
								'</tr>' +
							'</thead>' +
							'<tbody>';
								for (var i = 0; i < data[9].length; i++) { matchupStatBox +=
									'<tr>' +
										'<td><a href="http://mlultimate.com/player/?pid=' + data[9][i].PlayerID + '">' + data[9][i].Player + '</a></td>' +
										'<td>' + data[9][i].Points + '</td>' +
										'<td>' + data[9][i].Goals + '</td>' +
										'<td>' + data[9][i].Assists + '</td>' +
										'<td>' + data[9][i].Blocks + '</td>' +
										'<td>' + data[9][i].Completions + '</td>' +
										'<td class="hideSmall">' + data[9][i].ThrowsAttempted + '</td>';
										if (data[9][i].CompPer == null) {
											matchupStatBox += '<td>0.0%</td>';
										} else {
											matchupStatBox += '<td>' + data[9][i].CompPer + '%</td>';
										};
										matchupStatBox +=
										'<td>' + data[9][i].Turnovers + '</td>' +
										'<td>' + data[9][i].OPointsPlayed + '</td>' +
										'<td>' + data[9][i].DPointsPlayed + '</td>' +
									'</tr>';
								}; matchupStatBox +=
							'</tbody>' +
						'</table>' +
					'</div>' +
				'</div>';
			$('#boxScoreBoxStatBox').html(matchupStatBox);
		};
	// End creating pregame matchup

	// Changing Pregame Matchup
		var generateComparison = function(data) { var updateSummary =
			'<table>' +
				'<thead>' +
					'<tr>' +
						'<th>Team</th>' +
						'<th title="Wins">W</th>' +
						'<th title="Goals">G</th>' +
						'<th title="Blocks">B</th>' +
						'<th title="Completions">CMP</th>' +
						'<th title="Throws">THR</th>' +
						'<th title="Completion Percentage">CMP%</th>' +
						'<th title="Turnovers">T</th>' +
						'<th title="Drop">D</th>' +
						'<th title="Throws into Blocks">TiB</th>' +
						'<th title="Fouls">F</th>' +
					'</tr>' +
				'</thead>' +
				'<tbody>' +
					'<tr>' +
						'<td>' + data[statTypeOne][0].Team + '</td>' +
						'<td> wins # </td>' + //' + data[statTypeOne][0].Wins + '
						'<td>' + data[statTypeOne][0].Goals + '</td>' +
						'<td>' + data[statTypeOne][0].Blocks + '</td>' +
						'<td>' + data[statTypeOne][0].Completions + '</td>' +
						'<td>' + data[statTypeOne][0].ThrowsAttempted + '</td>' +
						'<td>' + data[statTypeOne][0].CompPer + '%</td>' +
						'<td>' + data[statTypeOne][0].Turnovers + '</td>' +
						'<td>' + data[statTypeOne][0].Drops + '</td>' +
						'<td>' + data[statTypeOne][0].ThrowIntoBlocks + '</td>' +
						'<td>' + data[statTypeOne][0].Fouls + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td>' + data[statTypeTwo][0].Team + '</td>' +
						'<td> wins # </td>' + //' + data[statTypeTwo][0].Wins + '
						'<td>' + data[statTypeTwo][0].Goals + '</td>' +
						'<td>' + data[statTypeTwo][0].Blocks + '</td>' +
						'<td>' + data[statTypeTwo][0].Completions + '</td>' +
						'<td>' + data[statTypeTwo][0].ThrowsAttempted + '</td>' +
						'<td>' + data[statTypeTwo][0].CompPer + '%</td>' +
						'<td>' + data[statTypeTwo][0].Turnovers + '</td>' +
						'<td>' + data[statTypeTwo][0].Drops + '</td>' +
						'<td>' + data[statTypeTwo][0].ThrowIntoBlocks + '</td>' +
						'<td>' + data[statTypeTwo][0].Fouls + '</td>' +
					'</tr>' +
				'</tbody>' +
			'</table>';
			$('.mu-teamCompareDiv').html(updateSummary);
		};
	// End Changing Pregame Matchup

	// Extras
		var extrasBoxscore = function() {
			// Click for scoring setup
				$(document).on('click', '.playerHighlightRadioHome', function(e) {
					var radio = $(this);
					var player = $(e.target).attr('value');
					if (radio.data('waschecked') == true) {
						radio.prop('checked', false);
						radio.data('waschecked', false);
						$('.' + player + 'Goal').removeClass("activeHighlightGoal");
						$('.' + player + 'Assist').removeClass("activeHighlightAssist");
					} else {
						radio.data('waschecked', true);
						$('.' + player + 'Goal').addClass("activeHighlightGoal");
						$('.' + player + 'Assist').addClass("activeHighlightAssist");
						radio.siblings('input[name="playerHighlightHome"]').data('waschecked', false);
					};
				});
				$(document).on('click', '.playerHighlightRadioAway', function(e) {
					var radio = $(this);
					var player = $(e.target).attr('value');
					if (radio.data('waschecked') == true) {
						radio.prop('checked', false);
						radio.data('waschecked', false);
						$('.' + player + 'Goal').removeClass("activeHighlightGoal");
						$('.' + player + 'Assist').removeClass("activeHighlightAssist");
					} else {
						radio.data('waschecked', true);
						$('.' + player + 'Goal').addClass("activeHighlightGoal");
						$('.' + player + 'Assist').addClass("activeHighlightAssist");
						radio.siblings('input[name="playerHighlightHome"]').data('waschecked', false);
					};
				});
			// End click for scoring setup

			// Tab Control
				$(document).on('click', '.tabs .tab-links a', function(e) {
					var currentAttrValue = $(e.target).attr('href');
					$('.tabs ' + currentAttrValue).show().siblings().hide();
					$(e.target).parent('li').addClass('active1').siblings().removeClass('active1');
					e.preventDefault();
				});
			// End Tab Control

			// Changing the bottom portion
				$(document).on('change', '.mu-statTypePicker', function() {
					statTypeOne = parseInt($('.mu-statTypePicker').val());
					statTypeTwo = statTypeOne + 3;
					$.ajax({
						url:"https://mlustats.herokuapp.com/api/v1/matchup?gid=" + gameId,
						type: "get",
						success: function(data) {
							generateComparison(data);
						},
					});
				})
			// End changing the bottom portion
		};

		// Hide header
			function hideHeader() {
				$('.cb-cat-header').hide();
			};
		// End hide header

		// Overlay Text
			function overLayIt() {
			    // function to show our popups
			    function showPopup(whichpopup){
			        var docHeight = $(document).height(); //grab the height of the page
			        var scrollTop = $(window).scrollTop(); //grab the px value from the top of the page to where you're scrolling
			        $('.overlay-bg').show().css({'height' : docHeight}); //display your popup background and set height to the page height
			        $('.popup'+whichpopup).show().css({'top': scrollTop+20+'px'}); //show the appropriate popup and set the content 20px from the window top
			    }
			    // function to close our popups
			    function closePopup(){
			        $('.overlay-bg, .overlay-content').hide(); //hide the overlay
			    }
			    // show popup when you click on the link
			    $('.show-popup').click(function(event){
			        event.preventDefault(); // disable normal link function so that it doesn't refresh the page
			        var selectedPopup = $(this).data('showpopup'); //get the corresponding popup to show
			         
			        showPopup(selectedPopup); //we'll pass in the popup number to our showPopup() function to show which popup we want
			    });
			    // hide popup when user clicks on close button or if user clicks anywhere outside the container
			    $('.close-btn, .overlay-bg').click(function(){
			        closePopup();
			    });
			    // hide the popup when user presses the esc key
			    $(document).keyup(function(e) {
			        if (e.keyCode == 27) { // if user presses esc key
			            closePopup();
			        }
			    });
			};
		// End Overlay Text
	// End Extras
// END BOXSCORE

// LEAGUE LEADERS
	// Picking Data and Setup
		$(document).ready(function() {
			if($('#leagueLeadersContent').length) {
				getStatsLeagueLeaders('?sid='+ 4);
			};
		});
		var getStatsLeagueLeaders = function(url) {
			var sid = url || '';
			$.ajax({
		        url:"http://mlustats.herokuapp.com/api/v1/players" + sid + '&tid=0',
		        type:"get",
		        success:function(data){
		        	processDataLeagueLeaders(data[0]);
					extrasLeagueLeaders(data);
		        }
		    });
		};
	// End Picking Data and Setup

	// Creating League Leaders
		var processDataLeagueLeaders = function(data) {
			var sortByProperty = function (property) {
			    return function (x, y) {
			        return ((x[property] === y[property]) ? 0 : ((x[property] < y[property]) ? 1 : -1));
			    };
			}; var leagueLeaders = 
			'<div id="scoringBox" class="statBox leftBox">' +
				'<h2 class="statName"><a href="http://mlultimate.com/player-statistics-2/?st=2">Scoring ></a></h2>' +
				'<div class="playerPic"><a href="http://mlultimate.com/player/?pid=' + data[0].PlayerID +'"><img class="playerPicImg" src="'
					if(data[0].PlayerPic == null) { leagueLeaders +=
						'//fantasy.mlultimate.com/img/players/default_player.png';
			        } else { leagueLeaders +=
			        	data[0].PlayerPic;
			        }; leagueLeaders += '"></a>' +
			    '</div>' +
		        '<div class="playerStatsLL">';
					j = 1;
					var percentGA = data[0].G_A;
					for (var i = 0; i < 5; i++) { leagueLeaders +=
						'<div id="playerStatsLLBox" class="' + data[i].PlayerID + '">' +
							'<div class="' + data[i].PlayerID + '" id="playerStatsLLNumber">' + data[i].G_A + '</div>' +
					        '<div class="' + data[i].PlayerID + '" id="playerStatsLLName"><a class="' + data[i].PlayerID + '" href="http://mlultimate.com/player/?pid=' + data[i].PlayerID +'">' + data[i].Name + ' (' + data[i].ShortTeam + ')</a></div>' +
					        '<div class="' + data[i].PlayerID; if (i == 0) {leagueLeaders += ' activeLeader';}; leagueLeaders += '" id="percentTotalLeaders" style="width: ' + ((((data[i].G_A)/(percentGA))*(100))-(15)) + '%;"></div>' +
				    	'</div>';
				    }; leagueLeaders +=
				'</div>' +
			'</div>'; //End scoringBox
			data.sort(sortByProperty('Goals')); leagueLeaders +=
			'<div id="goalsBox" class="statBox rightBox">' +
				'<h2 class="statName"><a href="http://mlultimate.com/player-statistics-2/?st=3">Goals ></a></h2>' +
				'<div class="playerPic"><a href="http://mlultimate.com/player/?pid=' + data[0].PlayerID +'"><img class="playerPicImg" src="'
					if(data[0].PlayerPic == null) { leagueLeaders +=
						'//fantasy.mlultimate.com/img/players/default_player.png';
		            } else { leagueLeaders +=
		            	data[0].PlayerPic;
		            }; leagueLeaders += '"></a>' +
		        '</div>' +
		    	'<div class="playerStatsLL">';
					j = 1;
					var percentGA = data[0].Goals;
					for (var i = 0; i < 5; i++) { leagueLeaders +=
						'<div id="playerStatsLLBox" class="' + data[i].PlayerID + '">' +
							'<div class="' + data[i].PlayerID + '" id="playerStatsLLNumber">' + data[i].Goals + '</div>' +
					        '<div class="' + data[i].PlayerID + '" id="playerStatsLLName"><a class="' + data[i].PlayerID + '" href="http://mlultimate.com/player/?pid=' + data[i].PlayerID +'">' + data[i].Name + ' (' + data[i].ShortTeam + ')</a></div>' +
					        '<div class="' + data[i].PlayerID; if (i == 0) {leagueLeaders += ' activeLeader';}; leagueLeaders += '" id="percentTotalLeaders" style="width: ' + ((((data[i].Goals)/(percentGA))*(100))-(15)) + '%;"></div>' +
				    	'</div>';
				    }; leagueLeaders += 
				'</div>' +
			'</div>'; //End goalsBox
			data.sort(sortByProperty('Assists')); leagueLeaders +=
			'<div id="assistsBox" class="statBox leftBox">' +
				'<h2 class="statName"><a href="http://mlultimate.com/player-statistics-2/?st=4">Assists ></a></h2>' +
				'<div class="playerPic"><a href="http://mlultimate.com/player/?pid=' + data[0].PlayerID +'"><img class="playerPicImg" src="'
					if(data[0].PlayerPic == null) { leagueLeaders +=
						'//fantasy.mlultimate.com/img/players/default_player.png';
		            } else { leagueLeaders +=
		            	data[0].PlayerPic;
		            }; leagueLeaders += '"></a>' +
		        '</div>' +
		        '<div class="playerStatsLL">';
					j = 1;
					var percentGA = data[0].Assists;
					for (var i = 0; i < 5; i++) { leagueLeaders +=
						'<div id="playerStatsLLBox" class="' + data[i].PlayerID + '">' +
							'<div class="' + data[i].PlayerID + '" id="playerStatsLLNumber">' + data[i].Assists + '</div>' +
					        '<div class="' + data[i].PlayerID + '" id="playerStatsLLName"><a class="' + data[i].PlayerID + '" href="http://mlultimate.com/player/?pid=' + data[i].PlayerID +'">' + data[i].Name + ' (' + data[i].ShortTeam + ')</a></div>' +
					        '<div class="' + data[i].PlayerID; if (i == 0) {leagueLeaders += ' activeLeader';}; leagueLeaders += '" id="percentTotalLeaders" style="width: ' + ((((data[i].Assists)/(percentGA))*(100))-(15)) + '%;"></div>' +
				    	'</div>';
				    }; leagueLeaders +=
				'</div>' +
			'</div>'; //End assistsBox
			data.sort(sortByProperty('Blocks')); leagueLeaders +=
			'<div id="blocksBox" class="statBox rightBox">' +
				'<h2 class="statName"><a href="http://mlultimate.com/player-statistics-2/?st=5">Blocks ></a></h2>' +
				'<div class="playerPic"><a href="http://mlultimate.com/player/?pid=' + data[0].PlayerID +'"><img class="playerPicImg" src="'
					if(data[0].PlayerPic == null) { leagueLeaders +=
						'//fantasy.mlultimate.com/img/players/default_player.png';
		            } else { leagueLeaders += 
		            	data[0].PlayerPic;
		            }; leagueLeaders += '"></a>' +
		        '</div>' +
		        '<div class="playerStatsLL">';
					j = 1;
					var percentGA = data[0].Blocks;
					for (var i = 0; i < 5; i++) { leagueLeaders +=
						'<div id="playerStatsLLBox" class="' + data[i].PlayerID + '">' +
							'<div class="' + data[i].PlayerID + '" id="playerStatsLLNumber">' + data[i].Blocks + '</div>' +
					        '<div class="' + data[i].PlayerID + '" id="playerStatsLLName"><a class="' + data[i].PlayerID + '" href="http://mlultimate.com/player/?pid=' + data[i].PlayerID +'">' + data[i].Name + ' (' + data[i].ShortTeam + ')</a></div>' +
					        '<div class="' + data[i].PlayerID; if (i == 0) {leagueLeaders += ' activeLeader';}; leagueLeaders += '" id="percentTotalLeaders" style="width: ' + ((((data[i].Blocks)/(percentGA))*(100))-(15)) + '%;"></div>' +
				    	'</div>';
				    }; leagueLeaders +=
				'</div>' +
			'</div>'; //End blocksBox
			data.sort(sortByProperty('TPOP')); leagueLeaders +=
			'<div id="tpopBox" class="statBox leftBox">' +
				'<h2 class="statName"><a href="http://mlultimate.com/player-statistics-2/?st=14">TPOP ></a></h2>' +
				'<div class="playerPic"><a href="http://mlultimate.com/player/?pid=' + data[0].PlayerID +'"><img class="playerPicImg" src="'
					if(data[0].PlayerPic == null) { leagueLeaders +=
						'//fantasy.mlultimate.com/img/players/default_player.png';
		            } else { leagueLeaders +=
		            	data[0].PlayerPic;
		            }; leagueLeaders += '"></a>' +
		        '</div>' +
		        '<div class="playerStatsLL">';
					j = 1;
					var percentGA = data[0].TPOP;
					for (var i = 0; i < 5; i++) { leagueLeaders +=
						'<div id="playerStatsLLBox" class="' + data[i].PlayerID + '">' +
					        '<div class="' + data[i].PlayerID + '" id="playerStatsLLNumber">' + data[i].TPOP + '</div>' +
					        '<div class="' + data[i].PlayerID + '" id="playerStatsLLName"><a class="' + data[i].PlayerID + '" href="http://mlultimate.com/player/?pid=' + data[i].PlayerID +'">' + data[i].Name + ' (' + data[i].ShortTeam + ')</a></div>' +
					        '<div class="' + data[i].PlayerID; if (i == 0) {leagueLeaders += ' activeLeader';}; leagueLeaders += '" id="percentTotalLeaders" style="width: ' + ((((data[i].TPOP)/(percentGA))*(100))-(15)) + '%;"></div>' +
				    	'</div>';
				    }; leagueLeaders +=
				'</div>' +
			'</div>'; //End tpopBox
			data.sort(sortByProperty('PointsPlayed')); leagueLeaders +=
			'<div id="pointsplayedBox" class="statBox rightBox">' +
				'<h2 class="statName"><a href="http://mlultimate.com/player-statistics-2/?st=16">Points Played ></a></h2>' +
				'<div class="playerPic"><a href="http://mlultimate.com/player/?pid=' + data[0].PlayerID +'"><img class="playerPicImg" src="'
					if(data[0].PlayerPic == null) { leagueLeaders +=
						'//fantasy.mlultimate.com/img/players/default_player.png';
		            } else { leagueLeaders +=
		            	data[0].PlayerPic;
		            }; leagueLeaders += '"></a>' +
		        '</div>' +
		        '<div class="playerStatsLL">';
					j = 1;
					var percentGA = data[0].PointsPlayed;
					for (var i = 0; i < 5; i++) { leagueLeaders +=
						'<div id="playerStatsLLBox" class="' + data[i].PlayerID + '">' +
							'<div class="' + data[i].PlayerID + '" id="playerStatsLLNumber">' + data[i].PointsPlayed + '</div>' +
					        '<div class="' + data[i].PlayerID + '" id="playerStatsLLName"><a class="' + data[i].PlayerID + '" href="http://mlultimate.com/player/?pid=' + data[i].PlayerID +'">' + data[i].Name + ' (' + data[i].ShortTeam + ')</a></div>' +
					        '<div class="' + data[i].PlayerID; if (i == 0) {leagueLeaders += ' activeLeader';}; leagueLeaders += '" id="percentTotalLeaders" style="width: ' + ((((data[i].PointsPlayed)/(percentGA))*(100))-(15)) + '%;"></div>' +
				    	'</div>';
				    }; leagueLeaders +=
				'</div>' +
			'</div>'; //End pointsplayedBox
			$('.sk-fading-circle').hide();
		    $('#leagueLeadersContent').show();
			$('#leagueLeadersContent').html(leagueLeaders);
		};	
	// End Creating League Leaders

	// Extras
		var extrasLeagueLeaders = function(data) {
			$(document).on('change', '#seasonSelectLeagueLeaders', function() {
			    var val = $('#seasonSelectLeagueLeaders').val();
			    $('.sk-fading-circle').show();
			    $('#leagueLeadersContent').hide();
			    getStatsLeagueLeaders('?sid='+val);
			});

			// Change Player Photos
				$(document).on('mouseenter', '#scoringBox #percentTotalLeaders', function(e) {
					$('#scoringBox .activeLeader').removeClass('activeLeader');
					playerFocus = $(e.target).attr('class');
					var newPhoto = ''
					for (var i = 0; i < data[0].length; i++) { 
						if (data[0][i].PlayerID == playerFocus) { newPhoto +=
							'<a href="http://mlultimate.com/player/?pid=' + data[0][i].PlayerID +'"><img class="playerPicImg" src="'
								if(data[0][i].PlayerPic == null) { newPhoto +=
									'//fantasy.mlultimate.com/img/players/default_player.png';
					            } else { newPhoto +=
					            	data[0][i].PlayerPic;
					            }; newPhoto += '">' +
					        '</a>';
				    	};
					};
					$('#scoringBox .playerPic').html(newPhoto);
					$('#scoringBox #percentTotalLeaders.' + playerFocus).addClass('activeLeader');
				});
				$(document).on('mouseenter', '#goalsBox #percentTotalLeaders', function(e) {
					$('#goalsBox .activeLeader').removeClass('activeLeader');
					playerFocus = $(e.target).attr('class');
					var newPhoto = ''
					for (var i = 0; i < data[0].length; i++) { 
						if (data[0][i].PlayerID == playerFocus) { newPhoto +=
							'<a href="http://mlultimate.com/player/?pid=' + data[0][i].PlayerID +'"><img class="playerPicImg" src="'
								if(data[0][i].PlayerPic == null) { newPhoto +=
									'//fantasy.mlultimate.com/img/players/default_player.png';
					            } else { newPhoto += 
					            	data[0][i].PlayerPic;
					            }; newPhoto += '">' +
					        '</a>';
				    	};
					};
					$('#goalsBox .playerPic').html(newPhoto);
					$('#goalsBox #percentTotalLeaders.' + playerFocus).addClass('activeLeader');
				});
				$(document).on('mouseenter', '#assistsBox #percentTotalLeaders', function(e) {
					$('#assistsBox .activeLeader').removeClass('activeLeader');
					playerFocus = $(e.target).attr('class');
					var newPhoto = ''
					for (var i = 0; i < data[0].length; i++) { 
						if (data[0][i].PlayerID == playerFocus) { newPhoto +=
							'<a href="http://mlultimate.com/player/?pid=' + data[0][i].PlayerID +'"><img class="playerPicImg" src="'
								if(data[0][i].PlayerPic == null) { newPhoto +=
									'//fantasy.mlultimate.com/img/players/default_player.png';
					            } else { newPhoto +=
					            	data[0][i].PlayerPic;
					            }; newPhoto += '">' +
					        '</a>';
				    	};
					};
					$('#assistsBox .playerPic').html(newPhoto);
					$('#assistsBox #percentTotalLeaders.' + playerFocus).addClass('activeLeader');
				});
				$(document).on('mouseenter', '#blocksBox #percentTotalLeaders', function(e) {
					$('#blocksBox .activeLeader').removeClass('activeLeader');
					playerFocus = $(e.target).attr('class');
					var newPhoto = ''
					for (var i = 0; i < data[0].length; i++) { 
						if (data[0][i].PlayerID == playerFocus) { newPhoto +=
							'<a href="http://mlultimate.com/player/?pid=' + data[0][i].PlayerID +'"><img class="playerPicImg" src="'
								if(data[0][i].PlayerPic == null) { newPhoto +=
									'//fantasy.mlultimate.com/img/players/default_player.png';
					            } else { newPhoto +=
					            	data[0][i].PlayerPic;
					            }; newPhoto += '">' +
					        '</a>';
				    	};
					};
					$('#blocksBox .playerPic').html(newPhoto);
					$('#blocksBox #percentTotalLeaders.' + playerFocus).addClass('activeLeader');
				});
				$(document).on('mouseenter', '#tpopBox #percentTotalLeaders', function(e) {
					$('#tpopBox .activeLeader').removeClass('activeLeader');
					playerFocus = $(e.target).attr('class');
					var newPhoto = ''
					for (var i = 0; i < data[0].length; i++) { 
						if (data[0][i].PlayerID == playerFocus) { newPhoto +=
							'<a href="http://mlultimate.com/player/?pid=' + data[0][i].PlayerID +'"><img class="playerPicImg" src="'
								if(data[0][i].PlayerPic == null) { newPhoto +=
									'//fantasy.mlultimate.com/img/players/default_player.png';
					            } else { newPhoto +=
					            	data[0][i].PlayerPic;
					            }; newPhoto += '">' +
					        '</a>';
				    	};
					};
					$('#tpopBox .playerPic').html(newPhoto);
					$('#tpopBox #percentTotalLeaders.' + playerFocus).addClass('activeLeader');
				});
				$(document).on('mouseenter', '#pointsplayedBox #percentTotalLeaders', function(e) {
					$('#pointsplayedBox .activeLeader').removeClass('activeLeader');
					playerFocus = $(e.target).attr('class');
					var newPhoto = ''
					for (var i = 0; i < data[0].length; i++) { 
						if (data[0][i].PlayerID == playerFocus) { newPhoto +=
							'<a href="http://mlultimate.com/player/?pid=' + data[0][i].PlayerID +'"><img class="playerPicImg" src="'
								if(data[0][i].PlayerPic == null) { newPhoto +=
									'//fantasy.mlultimate.com/img/players/default_player.png';
					            } else { newPhoto +=
					            	data[0][i].PlayerPic;
					            }; newPhoto += '">' +
					        '</a>';
				    	};
					};
					$('#pointsplayedBox .playerPic').html(newPhoto);
					$('#pointsplayedBox #percentTotalLeaders.' + playerFocus).addClass('activeLeader');
				});
			// End Change Player Photos
		};
	// End Extras
// END LEAGUE LEADERS

// MINI STANDINGS
	// Picking Data and Setup
		$(document).ready(function() {
			if($('#ministandingsTableEast').length) {
				getStatsMiniStandings('?sid=' + 4);
			};
		});
		var getStatsMiniStandings = function(url) {
			var tid = url || '';
			$.ajax({
				url:"https://mlustats.herokuapp.com/api/standings" + tid,
				type: "get",
				success:function(data){
					processDataMiniStandings(data);
				},
			});
		};
	// End Picking Data and Setup

	// Create Standings
		var processDataMiniStandings = function(data) {
			var standingsEast = 
				'<table id="ministandingsTable">' +
					'<thead>' +
						'<th><div id="mstd_east"></div></th>' +
						'<th>W</th>' +
						'<th>L</th>' +
						'<th>G/F</th>' +
						'<th>G/A</th>' +
						'<th>STRK</th>' +
					'</thead>' +
					'<tbody>';
						for (var i = 0; i < data[0].length; i++) { standingsEast += 
							'<tr>' +
								'<td class="mstd_name">' +
									'<a href="http:'+ data[0][i].te_site_path + '">' +
										'<img src="http://mlultimate.com' + data[0][i].te_pic_35 + '" class="mstd_logo">' +
										'<span class="mstd-team-name">' + data[0][i].Team + '</span>' +
										'<span class="mstd-team-name abv">' + data[0][i].TeamShort + '</span>' +
									'</a>' +
								'</td>' +
								'<td class="mstd_wins">' + data[0][i].Wins + '</td>' +
								'<td class="mstd_losses">' + data[0][i].Losses + '</td>' +
								'<td class="mstd_gf">' + data[0][i].GoalsFor + '</td>' +
								'<td class="mstd_ga">' + data[0][i].GoalsAgainst + '</td>' +
								'<td class="mstd_stk">' + data[0][i].Streak + '</td>' +
							'</tr>';
						}; standingsEast += 
					'</tbody>' +
				'</table>';
			var standingsWest = 
				'<table id="ministandingsTable">' +
					'<thead>' +
						'<th><div id="mstd_west"></div></th>' +
						'<th>W</th>' +
						'<th>L</th>' +
						'<th>G/F</th>' +
						'<th>G/A</th>' +
						'<th>STRK</th>' +
					'</thead>' +
					'</tbody>';
						for (var i = 0; i < data[1].length; i++) { standingsWest +=
							'<tr>' +
								'<td class="mstd_name">' +
									'<a href="http:'+ data[1][i].te_site_path + '">' +
										'<img src="http://mlultimate.com' + data[1][i].te_pic_35 + '" class="mstd_logo">' +
										'<span class="mstd-team-name">' + data[1][i].Team + '</span>' +
										'<span class="mstd-team-name abv">' + data[1][i].TeamShort + '</span>' +
									'</a>' +
								'</td>' +
								'<td class="mstd_wins">' + data[1][i].Wins + '</td>' +
								'<td class="mstd_losses">' + data[1][i].Losses + '</td>' +
								'<td class="mstd_gf">' + data[1][i].GoalsFor + '</td>' +
								'<td class="mstd_ga">' + data[1][i].GoalsAgainst + '</td>' +
								'<td class="mstd_stk">' + data[1][i].Streak + '</td>' +
							'</tr>';
						}; standingsWest += 
					'</tbody>' +
				'</table>';
			$('#ministandingsTableEast').html(standingsEast);
			$('#ministandingsTableWest').html(standingsWest);
			$('#ministandingsTableEast > #ministandingsTable > tbody > tr:even').addClass('even');
			$('#ministandingsTableEast > #ministandingsTable > tbody > tr:odd').addClass('odd');
			$('#ministandingsTableWest > #ministandingsTable > tbody > tr:even').addClass('even');
			$('#ministandingsTableWest > #ministandingsTable > tbody > tr:odd').addClass('odd');
		};
	// End Create Standings
// END MINI STANDINGS

// MLU LIVE SCHEDULE
	// Picking Data and Setup
	  $(document).ready(function() {
	      if($('#futureSchedule').length) {
	        getStatsMLULiveSchedule('?sid=' + 4);
	      };
	  });
	  var getStatsMLULiveSchedule = function(url) {
	     var sid = url || '';
	     $.ajax({
	         url:"https://mlustats.herokuapp.com/api/schedule" + sid,
	         type: "get",
	         success:function(data){
	             processDataMLULiveSchedule(data);
	         }
	     });
	  };
	// End Picking Data and Setup

	// Create MLULive Schedule
	  	var processDataMLULiveSchedule = function(data) { var container =
	  		'<div id="sch-sat-table-wrap">' + '<table id="loopTable">';
	    		var currentDay = '';
	    		for (var i = 0; i < data[0].length; i++) {
		      		if (data[0][i].Date != currentDay && data[0][i].Status !== "Final" && data[0][i].GameID !== 175) { container += '</table>' +
		        		'<table class="mlul-sch-sat-table week' + i; container += '">' +
		          			'<caption>' + data[0][i].Day + ' ' + data[0][i].Date + '</caption>' +
		          			'<thead>' +
		            			'<tr class="mlul-sch-header">' +
		              				'<th colspan="3" class="mlul-matchup">Matchup</th>' +
		              				'<th>Eastern Time</th>' +
		              				'<th>Pacific Time</th>' +
		              				'<th class="mlul-hideSmall mlul-location">Location</th>' +
		            			'</tr>' +
		          			'</thead>' +
		          			'<tbody>';
		        			currentDay = data[0][i].Date;
		      		};
		      		if (data[0][i].Status == "Final" || data[0][i].GameID == 175) {} else { var row2 = 
		      			'<tr>' +
		          			'<td>' +
		            			'<div class="mlul-away_team">' +
		              				'<a href="http:' + data[0][i].AwayTeamSite + '"><p class="mlul-ms-team-name-go">' + data[0][i].AwayTeam + '</p></a>' +
		            			'</div>' +
				          	'</td>' +
				          	'<td class="mlul-ater">AT</td>' +
				          	'<td>' +
					            '<div class="mlul-home_team">' +
					              	'<a href="http:' + data[0][i].HomeTeamSite + '"><p class="mlul-ms-team-name-go">' + data[0][i].HomeTeam + '</p></a>' +
					            '</div>' +
		          			'</td>';
				          	var baseTime = data[0][i].Time;
				          	var pacificTime = "";
				          	var easternTime = "";
				          	var hours = "";
			          		if (data[0][i].TZ == "ET") {
			            		easternTime = data[0][i].Time + ' ET';
				            	if (baseTime.length == 6) {
				              		var hours = baseTime.slice(0,1);
				            	} else if (baseTime.length == 7) {
				              		var hours = baseTime.slice(0,2);
				            	};
					            var hoursNum = parseInt(hours);
					            hoursNum--;
					            hoursNum--;
					            hoursNum--;
					            pacificTime = hoursNum + ':00 PT';
					            if (pacificTime == '0:00 PT') {
				              		pacificTime = '12:00 PT';
				            	};
				          	};
				          	if (data[0][i].TZ == "PT") {
					            pacificTime = data[0][i].Time + ' PT';
					            if (baseTime.length == 6) {
					              	var hours = baseTime.slice(0,1);
					            } else if (baseTime.length == 7) {
					             	var hours = baseTime.slice(0,2);
					            };
					            var hoursNum = parseInt(hours);
					            hoursNum++;
					            hoursNum++;
					            hoursNum++;
					            easternTime = hoursNum + ':00 ET';
				          	}; row2 +=
		          			'<td>' + easternTime + '</td>' +
		          			'<td>' + pacificTime + '</td>' +
		          			'<td class="mlul-hideSmall">' + data[0][i].Location + '</td>' +
		        		'</tr>';
		        		container += row2;
		      		};
	    		}; container += '</tbody>' +
	    	'</table></div>';
		    $('.sk-fading-circle').hide();
		    $('#futureSchedule').show();
		    $('#futureSchedule').html(container);
	  	};
	// End Create MLULive Schedule
// END MLU LIVE SCHEDULE

// PLAYER LIST
	// Getting URL Parameters
	    var getUrlParameter = function getUrlParameter(sParam) {
	        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;
	        for (i = 0; i < sURLVariables.length; i++) {
	            sParameterName = sURLVariables[i].split('=');
	            if (sParameterName[0] === sParam) {
	                return sParameterName[1] === undefined ? true : sParameterName[1];
	            };
	        };
	    };
	    var statNumber = getUrlParameter('st');
	// End Getting URL Parameters

	// Picking Data and Setup
	  	$(document).ready(function() {
		    if($('#pls-container').length) {
		    	getStatsPlayersList('?sid=' + 4);
		    	extrasPlayersList();
		    };
	  	});
	  	var getStatsPlayersList = function(url) {
	    	var sid = url || '';
	    	$.ajax({
		        url:"http://mlustats.herokuapp.com/api/v1/players" + sid + '&tid=0',
		        type:"get",
		        success:function(data){
		        	processStatsPlayers(data[0]);
		            $('.tablesorter').DataTable({"pagingType": "simple", "select": "true", "order": [[statNumber,"desc"]]});
		        }
	      	});
	  	};
	// End Picking Data and Setup

	// Create Players List
	  	var processStatsPlayers = function(data) { var table =
    		'<table id="statsTableMLU" class="stat-table tablesorter hover-highlight">' +
       			'<thead>' +
          			'<tr id="shallIStay">' +
			            '<th data-sort="string">Player</th>' +
			            '<th>Team</th>' +
			            '<th title="Goals and Assists">G+A</th>' +
			            '<th title="Goals">G</th>' +
			            '<th title="Assists">A</th>' +
			            '<th title="Blocks">B</th>' +
			            '<th title="Bands">BND</th>' +
			            '<th title="Completions">CMP</th>' +
			            '<th title="Throws">THR</th>' +
			            '<th title="Completion Percentage">CMP%</th>' +
			            '<th title="Catches">CAT</th>' +
			            '<th title="Callahans">C</th>' +
			            '<th title="Drops">D</th>' +
			            '<th title="Fouls">F</th>' +
			            '<th title="Touches per Offensive Possession">TPOP</th>' +
			            '<th title="Turnovers">T</th>' +
			            '<th title="Points Played">PP</th>' +
			            '<th title="Offensive Points Played">OP</th>' +
			            '<th title="Defensive Points Played">DP</th>' +
			            '<th title="Offensive Scoring Efficiency">OSE</th>' +
			            '<th title="Defensive Scoring Efficiency">DSE</th>' +
			            '<th title="Defensive Turnover Efficiency">DTE</th>' +
          			'</tr>' +   
        		'</thead>' + 
        		'<tbody>';
			    	for (var i = 0; i < data.length; i++) { table += 
			    		'<tr>' +
				        	'<td class="cellPlay"><a href="http://mlultimate.com/player/?pid=' + data[i].PlayerID + '">' + data[i].Name + '</a></td>' +
				        	'<td class="cellTeam" tabindex="1">' + data[i].ShortTeam + '</td>' +
				        	'<td class="cellPoin" tabindex="1">' + data[i].G_A + '</td>' +
				        	'<td class="cellGoal" tabindex="1">' + data[i].Goals + '</td>' +
				        	'<td class="cellAssi" tabindex="1">' + data[i].Assists + '</td>' +
				        	'<td class="cellBloc" tabindex="1">' + data[i].Blocks + '</td>' +
				        	'<td class="cellBand" tabindex="1">' + data[i].Bands + '</td>' +
				        	'<td class="cellCom1" tabindex="1">' + data[i].Completions + '</td>' +
				        	'<td class="cellThro" tabindex="1">' + data[i].Throws + '</td>' +
				        	'<td class="cellCom2" tabindex="1">' + data[i].CompletionPercentage + '%</td>' +
				        	'<td class="cellCatc" tabindex="1">' + data[i].Catches + '</td>' +
				        	'<td class="cellCall" tabindex="1">' + data[i].Callahans + '</td>' +
				        	'<td class="cellDrop" tabindex="1">' + data[i].Drops + '</td>' +
				        	'<td class="cellFoul" tabindex="1">' + data[i].Fouls + '</td>' +
				        	'<td class="cellTouc" tabindex="1">' + data[i].TPOP + '</td>' +
				        	'<td class="cellTurn" tabindex="1">' + data[i].Turnovers + '</td>' +
				        	'<td class="cellPoin" tabindex="1">' + data[i].PointsPlayed + '</td>' +
				        	'<td class="cellOff1" tabindex="1">' + data[i].OPointsPlayed + '</td>' +
				        	'<td class="cellDef1" tabindex="1">' + data[i].DPointsPlayed + '</td>' +
				        	'<td class="cellOff2" tabindex="1">' + data[i].OSE + '%</td>' +
				        	'<td class="cellDef2" tabindex="1">' + data[i].DSE + '%</td>' +
				        	'<td class="cellDef3" tabindex="1">' + data[i].DTE + '%</td>' +
			        	'</tr>';
			      	}; table += 
			    '</tbody>' +
			'</table>';
		    $('.sk-fading-circle').hide();
		    $('#pls-container').show();
		    $('#pls-container').html(table);
	  	};
	// End Create Players List

	// Extras
		var extrasPlayersList = function() {
		  	$(document).on('change', '#seasonSelectPlayersList', function() {
		      	var val = $('#seasonSelectPlayersList').val();
		      	$('.sk-fading-circle').show();
		      	$('#pls-container').hide();
		      	getStatsPlayersList('?sid=' + val);
		  	});
		  	$(function() {
		    	$("#statsTableMLU").tablesorter({
		    	  	theme: 'blue',
		    	  	widgets: ["filter"],
		    	 	widgetOptions: {
		    	    	filter_external: '.search',
		        		filter_defaultFilter: { 1 : '~{query}' },
		        		filter_columnFilters: false
		    	  	}
		    	});
		    	if ($(window).width() > 1199) {
		        	// Make table cell focusable
		      		if ( $('.focus-highlight').length ) {
		        		$('.focus-highlight').find('td, th').attr('tabindex', '1');
		      		};
		    	};
		  	});
		};
	// End Extras
// END PLAYERS LIST

// PLAYER CARD
	// Getting URL Parameters
	    var getUrlParameter = function getUrlParameter(sParam) {
	        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
	        sURLVariables = sPageURL.split('&'),
	        sParameterName,
	        i;
	        for (i = 0; i < sURLVariables.length; i++) {
	            sParameterName = sURLVariables[i].split('=');
	            if (sParameterName[0] === sParam) {
	                return sParameterName[1] === undefined ? true : sParameterName[1];
	            };
	        };
	    };
	    var playerId = getUrlParameter('pid');
	// End Getting URL Parameters

	// Picking Data and Setup
	    $(document).ready(function() {
	        if($('#playerPageHead').length) {
	            getStatsPlayerCard(location.search);
	            extrasPlayerCard();
	        };
	    });
	    var playerDatar;
	    var getStatsPlayerCard = function() {
	        $.ajax({
	            url:"http://mlustats.herokuapp.com/api/v1/playerCard?pid=" + playerId,
	            type:"get",
	            success:function(res) {
	                window.location.hash = res[0][0].FirstName + '_' + res[0][0].LastName;
	                playerDatar = res;
	                if (res[0][0].HasStats == 1) {
	                    processPlayerCard(res, 4);
	                } else {
	                    processNewPlayerCard(res);
	                };
	                hideData();
	            }
	        });
	    };
	// Picking Data and Setup

	// Create Player Card
	    function processPlayerCard(data, season) {
	        document.title = data[0][0].FirstName + ' ' + data[0][0].LastName;
	        var currentSeason = parseInt(season);
	        var head = 
	        	'<a href="http://mlultimate.com/player-statistics-2/">>>> See All</a>' +
	            '<p class="player-team-header" style="background-color: ' + data[0][0].TeamColor + ';"><span class="player-team-header-name hideSmall">' + data[0][0].TeamCity + ' ' + data[0][0].Team + '</span><span class="player-team-header-name showBig">' + data[0][0].TeamCity + '</br>' + data[0][0].Team + '</span></p>' +
	            '<div id="headDivforPlayer">' +
	                '<div class="module-unit player-info-img"><img src="';
		                if(data[0][0].pic_path == null) { head +=
		                	'//fantasy.mlultimate.com/img/players/default_player.png';
		                } else { head +=
		                	data[0][0].pic_path;
		                }; head += '">' +
		            '</div>' +
	                '<div class="module-unit player-info">' +
	                    '<div class="player-info--person">' +
	                        '<h4 class="player-info--name">' + data[0][0].FirstName + ' ' + data[0][0].LastName + '</h4>';
	                        if(data[0][0].Twitter == null) {} else { head +=
	                        	'<p class="player-info--soc"><strong>Twitter:</strong> <a href="https://twitter.com/' + data[0][0].Twitter + '" target="_blank">' + data[0][0].Twitter + '</a></p>';
	                        }; head +=
	                        '<p class="player-info--num">#' + data[0][0].Number + ' - ' + data[0][0].Position + '</p>' +
	                    '</div>' +
	                    '<div class="player-info--meta">' +
	                        '<p class="player-info-meta"><strong>Height:</strong> ' + data[0][0].Height + ' <strong>Weight:</strong> ' + data[0][0].Weight + ' <strong>Age:</strong> ' + data[0][0].Age + '</p>' +
	                        '<p class="player-info-meta"><strong>College:</strong> ' + data[0][0].College + '</p>' +
	                        '<p class="player-info-meta"><strong>MLU Experience:</strong> ' + data[0][0].Experience + '</p>' +
	                        '<p class="player-info-meta"><strong>High School:</strong> ' + data[0][0].highschool + '</p>' +
	                    '</div>' +
	                '</div>' +
	                '<div class="module-unit player-stats">' +
	                    '<div class="module-unit season-player-stats">';
	                		if(data[0][0].Active == 1) {
			                    for (var i = 0; i < data[3].length; i++) {
			                        if (data[3][i].ss_season_id_fk == data[0][0].ActiveSeason) { head +=
			                        	'<p class="headStatTitle"><strong>Season</strong></p>' +
			                            '<div class="season-stat-unit-row">' +
			                                '<div class="season-stat-unit">' +
			                                    '<p class="season-stat-unit-title">PTS</p>' +
			                                    '<p class="season-stat-unit-body">' + data[3][i].ss_points + '</p>' +
			                                '</div>' +
			                                '<div class="season-stat-unit">' +
			                                    '<p class="season-stat-unit-title">Goals</p>' +
			                                    '<p class="season-stat-unit-body">' + data[3][i].ss_goals + '</p>' +
			                                '</div>' +
			                                '<div class="season-stat-unit">' +
			                                    '<p class="season-stat-unit-title">ASSTS</p>' +
			                                    '<p class="season-stat-unit-body">' + data[3][i].ss_assists + '</p>' +
			                                '</div>' +
			                            '</div>' +
	                            		'<div class="season-stat-unit-row">' +
			                                '<div class="season-stat-unit">' +
			                                    '<p class="season-stat-unit-title">BLKS</p>' +
			                                    '<p class="season-stat-unit-body">' + data[3][i].ss_blocks + '</p>' +
			                                '</div>' +
			                                '<div class="season-stat-unit">' +
			                                    '<p class="season-stat-unit-title">CMP%</p>' +
			                                    '<p class="season-stat-unit-body">' + data[3][i].ss_completion_percentage + '%</p>' +
			                                '</div>' +
			                                '<div class="season-stat-unit">' +
			                                    '<p class="season-stat-unit-title">TPOP</p>' +
			                                    '<p class="season-stat-unit-body">' + data[3][i].ss_tpop + '</p>' +
			                                '</div>' +
			                            '</div>';
	                        		};
	                    		};
	                		}; head +=
	                	'</div>' +
		                '<div class="module-unit career-player-stats">' +
		                    '<p class="headStatTitle"><strong>Career</strong></p>' +
		                    '<div class="career-stat-unit-row">' +
		                        '<div class="career-stat-unit">' +
		                            '<p class="career-stat-unit-title">PTS</p>' +
		                            '<p class="career-stat-unit-body">' + data[5][0].ct_points + '</p>' +
		                        '</div>' +
		                        '<div class="career-stat-unit">' +
		                            '<p class="career-stat-unit-title">Goals</p>' +
		                            '<p class="career-stat-unit-body">' + data[5][0].ct_goals + '</p>' +
		                        '</div>' +
		                        '<div class="career-stat-unit">' +
		                            '<p class="career-stat-unit-title">ASSTS</p>' +
		                            '<p class="career-stat-unit-body">' + data[5][0].ct_assists + '</p>' +
		                        '</div>' +
		                    '</div>' +
		                    '<div class="career-stat-unit-row">' +
		                        '<div class="career-stat-unit">' +
		                            '<p class="career-stat-unit-title">BLKS</p>' +
		                            '<p class="career-stat-unit-body">' + data[5][0].ct_blocks + '</p>' +
		                        '</div>' +
		                        '<div class="career-stat-unit">' +
		                            '<p class="career-stat-unit-title">CMP%</p>' +
		                            '<p class="career-stat-unit-body">' + data[5][0].ct_completion_percentage + '%</p>' +
		                        '</div>' +
		                        '<div class="career-stat-unit">' +
		                            '<p class="career-stat-unit-title">TPOP</p>' +
		                            '<p class="career-stat-unit-body">' + data[5][0].ct_tpop + '</p>' +
		                        '</div>' +
		                    '</div>' +
		                '</div>' +
	                '</div>' +
	            '</div>';
	        $('#playerPageHead').html(head);
	        var body = 
	        	'<div id="playerData">' +
	        		'<select id="dataType">' + 
	            		'<option value="regularSeason">Regular Season</option>';
	            		if (data[2].length > 0) {body += '<option value="postSeason">Post Season</option>'}; body +=
	            		'<option value="season">Season</option>' +
	            		'<option value="careerRegular">Career Regular Season</option>';
	            		if (data[7].length > 0) {body += '<option value="careerPost">Career Post Season</option>'}; body +=
	            	'</select>' +
	            	'<select id="seasonPick" class="regularSeason postSeason box total">';
			            for (var i = 0; i < data[3].length; i++) {
			                body += '<option selected="selected" value="' + data[3][i].ss_season_id_fk + '">' + data[3][i].se_year + '</option>';
			            }; body +=
			        '</select>' +
		            '<select id="dataPick" class="season careerRegular careerPost box total">' + 
		                '<option value="total">Total</option>' +
		                '<option value="average">Average</option>' +
		            '</select>' +
	            	'<div id="regularSeason" class="regularSeason box total">' +
	                	'<div id="subtabs1" class="subtabs">' +
		                    '<ul class="subtab-links">' +
		                        '<li class="active"><a href="#subtab11">Overview</a></li>' +
		                        '<li><a href="#subtab12">Percentages</a></li>' +
		                        '<li><a href="#subtab13">Fouls/Turns</a></li>' +
		                        '<li><a href="#subtab14">Miscellaneous</a></li>' +
		                    '</ul>' +
	                    	'<div class="subtab-content">' +
	                        	'<div id="subtab11" class="subtab active">' +
	                            	'<table id="pl-statbox-basic-game" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Week"><span class="hideSmall">Week</span><span class="showBig">#</span></th>' +
		                                    '<th title="Date">Date</th>' +
		                                    '<th title="Opponent">Opp</th>' +
		                                    '<th title="Goals">G</th>' +
		                                    '<th title="Assists">A</th>' +
		                                    '<th title="Blocks">B</th>' +
		                                    '<th title="Points Played">PP</th>' +
		                                    '<th class="hideSmall" title="Completions">COMP</th>' +
		                                    '<th class="hideSmall" title="Throws">THR</th>' +
		                                    '<th title="Completion Percentage">COMP%</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[1].length; i++) {
			                                    if(data[1][i].gs_season_id_fk === currentSeason) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[1][i].gs_week + '</td>' +
			                                            '<td><a href="http://mlultimate.com/boxscore/?ga=' + data[1][i].gs_game_id_fk + '">'+ data[1][i].Date + '</a></td>' +
			                                            '<td>'+ data[1][i].gs_opponent + '</td>' +
			                                            '<td>'+ data[1][i].gs_goals + '</td>' +
			                                            '<td>'+ data[1][i].gs_assists + '</td>' +
			                                            '<td>'+ data[1][i].gs_blocks + '</td>' +
			                                            '<td>'+ data[1][i].gs_points_played + '</td>' +
			                                            '<td class="hideSmall">'+ data[1][i].gs_completions + '</td>' +
			                                            '<td class="hideSmall">'+ data[1][i].gs_throws + '</td>' +
			                                            '<td>'+ data[1][i].gs_completion_percentage + '%</td>' +
			                                            '<td>'+ data[1][i].gs_turnovers + '</td>' +
			                                        '</tr>'
			                                    };
			                                }; body +=
			                            '</tbody>' +
	                            	'</table>' +
	                        	'</div>' +
	                        	'<div id="subtab12" class="subtab">' +
		                            '<table id="pl-statbox-percentage-game" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Week"><span class="hideSmall">Week</span><span class="showBig">#</span></th>' +
		                                    '<th title="Date">Date</th>' +
		                                    '<th title="Opponent">Opp</th>' +
		                                    '<th class="hideSmall" title="Completion Percentage">COMP%</th>' +
		                                    '<th title="Offensive Scoring Efficiency">OSE</th>' +
		                                    '<th title="Defensive Scoring Efficiency">DSE</th>' +
		                                    '<th title="Defensive Turnover Efficiency">DTE</th>' +
		                                    '<th title="Defensive Turnover Scoring Efficiency">DTSE</th>' +
		                                    '<th title="Touches per Offensive Possession">TPOP</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[1].length; i++) {
			                                    if(data[1][i].gs_season_id_fk === currentSeason) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[1][i].gs_week + '</td>' +
			                                            '<td><a href="http://mlultimate.com/boxscore/?ga=' + data[1][i].gs_game_id_fk + '">'+ data[1][i].Date + '</a></td>' +
			                                            '<td>'+ data[1][i].gs_opponent + '</td>' +
			                                            '<td class="hideSmall">'+ data[1][i].gs_completion_percentage + '%</td>' +
			                                            '<td>'+ data[1][i].gs_ose + '%</td>' +
			                                            '<td>'+ data[1][i].gs_dse + '%</td>' +
			                                            '<td>'+ data[1][i].gs_dte + '%</td>' +
			                                            '<td>'+ data[1][i].gs_dtse + '%</td>' +
			                                            '<td>'+ data[1][i].gs_tpop + '</td>' +
			                                        '</tr>';
			                                    };
			                                }; body +=
			                            '</tbody>' +
		                            '</table>' +
	                        	'</div>' +
	                        	'<div id="subtab13" class="subtab">' +
		                            '<table id="pl-statbox-advanced-game" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Week">Week</th>' +
		                                    '<th title="Date">Date</th>' +
		                                    '<th title="Opponent">Opp</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                    '<th title="Fouls">F</th>' +
		                                    '<th title="Travels">Tr</th>' +
		                                    '<th title="Stalls">St</th>' +
		                                    '<th title="Throwaways">TA</th>' +
		                                    '<th title="Throws into Blocks">TiB</th>' +
		                                    '<th title="Drops">D</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[1].length; i++) {
			                                    if(data[1][i].gs_season_id_fk === currentSeason) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[1][i].gs_week + '</td>' +
			                                            '<td><a href="http://mlultimate.com/boxscore/?ga=' + data[1][i].gs_game_id_fk + '">'+ data[1][i].Date + '</a></td>' +
			                                            '<td>'+ data[1][i].gs_opponent + '</td>' +
			                                            '<td>'+ data[1][i].gs_turnovers + '</td>' +
			                                            '<td>'+ data[1][i].gs_fouls + '</td>' +
			                                            '<td>'+ data[1][i].gs_travels + '</td>' +
			                                            '<td>'+ data[1][i].gs_stalls + '</td>' +
			                                            '<td>'+ data[1][i].gs_throw_aways + '</td>' +
			                                            '<td>'+ data[1][i].gs_throw_into_blocks + '</td>' +
			                                            '<td>'+ data[1][i].gs_drops + '</td>' +
			                                        '</tr>';
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
	                        	'</div>' +
	                        	'<div id="subtab14" class="subtab">' +
		                            '<table id="pl-statbox-extra-game" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Week">Week</th>' +
		                                    '<th title="Date">Date</th>' +
		                                    '<th title="Opponent">Opp</th>' +
		                                    '<th title="Catches">C</th>' +
		                                    '<th title="Bookends">BE</th>' +
		                                    '<th title="Callahans">Call</th>' +
		                                    '<th title="Offensive Points Played">O-PP</th>' +
		                                    '<th title="Defensive Points Played">D-PP</th>' +
		                                    '<th title="Hockey Assists">HA</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[1].length; i++) {
			                                    if(data[1][i].gs_season_id_fk === currentSeason) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[1][i].gs_week + '</td>' +
			                                            '<td><a href="http://mlultimate.com/boxscore/?ga=' + data[1][i].gs_game_id_fk + '">'+ data[1][i].Date + '</a></td>' +
			                                            '<td>'+ data[1][i].gs_opponent + '</td>' +
			                                            '<td>'+ data[1][i].gs_catches + '</td>' +
			                                            '<td>'+ data[1][i].gs_bookends + '</td>' +
			                                            '<td>'+ data[1][i].gs_callahans + '</td>' +
			                                            '<td>'+ data[1][i].gs_o_points_played + '</td>' +
			                                            '<td>'+ data[1][i].gs_d_points_played + '</td>' +
			                                            '<td>'+ data[1][i].gs_hockey_assists + '</td>' +
			                                        '</tr>'
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
	                        	'</div>' +
	                    	'</div>' +
	                	'</div>' +
	            	'</div>' +
	            	'<div id="postSeason" class="postSeason box total">' +
	                	'<div id="subtabs1" class="subtabs">' +
		                    '<ul class="subtab-links">' +
		                        '<li class="active"><a href="#subtab11">Overview</a></li>' +
		                        '<li><a href="#subtab12">Percentages</a></li>' +
		                        '<li><a href="#subtab13">Fouls/Turns</a></li>' +
		                        '<li><a href="#subtab14">Miscellaneous</a></li>' +
		                    '</ul>' +
	                    	'<div class="subtab-content">' +
	                        	'<div id="subtab11" class="subtab active">' +
		                            '<table id="pl-statbox-basic-game" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Week"><span class="hideSmall">Week</span><span class="showBig">#</span></th>' +
		                                    '<th title="Date">Date</th>' +
		                                    '<th title="Opponent">Opp</th>' +
		                                    '<th title="Goals">G</th>' +
		                                    '<th title="Assists">A</th>' +
		                                    '<th title="Blocks">B</th>' +
		                                    '<th title="Points Played">PP</th>' +
		                                    '<th class="hideSmall" title="Completions">COMP</th>' +
		                                    '<th class="hideSmall" title="Throws">THR</th>' +
		                                    '<th title="Completion Percentage">COMP%</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                '</thead>' +
		                                '<tbody>';
		                                	for (var i = 0; i < data[2].length; i++) {
			                                    if(data[2][i].gs_season_id_fk === currentSeason) {
			                                        if (data[2].length == 0) { break; } else { body +=
			                                        	'<tr>' +
			                                                '<td>'+ data[2][i].gs_week + '</td>' +
			                                                '<td><a href="http://mlultimate.com/boxscore/?ga=' + data[2][i].gs_game_id_fk + '">'+ data[2][i].Date + '</a></td>' +
			                                                '<td>'+ data[2][i].gs_opponent + '</td>' +
			                                                '<td>'+ data[2][i].gs_goals + '</td>' +
			                                                '<td>'+ data[2][i].gs_assists + '</td>' +
			                                                '<td>'+ data[2][i].gs_blocks + '</td>' +
			                                                '<td>'+ data[2][i].gs_points_played + '</td>' +
			                                                '<td class="hideSmall">'+ data[2][i].gs_completions + '</td>' +
			                                                '<td class="hideSmall">'+ data[2][i].gs_throws + '</td>' +
			                                                '<td>'+ data[2][i].gs_completion_percentage + '%</td>' +
			                                                '<td>'+ data[2][i].gs_turnovers + '</td>' +
			                                            '</tr>';
			                                        };
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
	                        	'</div>' +
		                        '<div id="subtab12" class="subtab">' +
		                            '<table id="pl-statbox-percentage-game" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Week"><span class="hideSmall">Week</span><span class="showBig">#</span></th>' +
		                                    '<th title="Date">Date</th>' +
		                                    '<th title="Opponent">Opp</th>' +
		                                    '<th class="hideSmall" title="Completion Percentage">COMP%</th>' +
		                                    '<th title="Offensive Scoring Efficiency">OSE</th>' +
		                                    '<th title="Defensive Scoring Efficiency">DSE</th>' +
		                                    '<th title="Defensive Turnover Efficiency">DTE</th>' +
		                                    '<th title="Defensive Turnover Scoring Efficiency">DTSE</th>' +
		                                    '<th title="Touches per Offensive Possession">TPOP</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[2].length; i++) {
			                                    if(data[2][i].gs_season_id_fk === currentSeason) {
			                                        if (data[2].length == 0) { break; } else { body +=
			                                        	'<tr>' +
			                                                '<td>'+ data[2][i].gs_week + '</td>' +
			                                                '<td><a href="http://mlultimate.com/boxscore/?ga=' + data[2][i].gs_game_id_fk + '">'+ data[2][i].Date + '</a></td>' +
			                                                '<td>'+ data[2][i].gs_opponent + '</td>' +
			                                                '<td class="hideSmall">'+ data[2][i].gs_completion_percentage + '%</td>' +
			                                                '<td>'+ data[2][i].gs_ose + '%</td>' +
			                                                '<td>'+ data[2][i].gs_dse + '%</td>' +
			                                                '<td>'+ data[2][i].gs_dte + '%</td>' +
			                                                '<td>'+ data[2][i].gs_dtse + '%</td>' +
			                                                '<td>'+ data[2][i].gs_tpop + '</td>' +
			                                            '</tr>';
			                                        };
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab13" class="subtab">' +
		                            '<table id="pl-statbox-advanced-game" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Week">Week</th>' +
		                                    '<th title="Date">Date</th>' +
		                                    '<th title="Opponent">Opp</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                    '<th title="Fouls">F</th>' +
		                                    '<th title="Travels">Tr</th>' +
		                                    '<th title="Stalls">St</th>' +
		                                    '<th title="Throwaways">TA</th>' +
		                                    '<th title="Throws into Blocks">TiB</th>' +
		                                    '<th title="Drops">D</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[2].length; i++) {
			                                    if(data[2][i].gs_season_id_fk === currentSeason) {
			                                        if (data[2].length == 0) { break; } else { body +=
			                                        	'<tr>' +
			                                                '<td>'+ data[2][i].gs_week + '</td>' +
			                                                '<td><a href="http://mlultimate.com/boxscore/?ga=' + data[2][i].gs_game_id_fk + '">'+ data[2][i].Date + '</a></td>' +
			                                                '<td>'+ data[2][i].gs_opponent + '</td>' +
			                                                '<td>'+ data[2][i].gs_turnovers + '</td>' +
			                                                '<td>'+ data[2][i].gs_fouls + '</td>' +
			                                                '<td>'+ data[2][i].gs_travels + '</td>' +
			                                                '<td>'+ data[2][i].gs_stalls + '</td>' +
			                                                '<td>'+ data[2][i].gs_throw_aways + '</td>' +
			                                                '<td>'+ data[2][i].gs_throw_into_blocks + '</td>' +
			                                                '<td>'+ data[2][i].gs_drops + '</td>' +
			                                            '</tr>';
			                                        };
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab14" class="subtab">' +
		                            '<table id="pl-statbox-extra-game" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Week">Week</th>' +
		                                    '<th title="Date">Date</th>' +
		                                    '<th title="Opponent">Opp</th>' +
		                                    '<th title="Catches">C</th>' +
		                                    '<th title="Bookends">BE</th>' +
		                                    '<th title="Callahans">Call</th>' +
		                                    '<th title="Offensive Points Played">O-PP</th>' +
		                                    '<th title="Defensive Points Played">D-PP</th>' +
		                                    '<th title="Hockey Assists">HA</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[2].length; i++) {
			                                    if(data[2][i].gs_season_id_fk === currentSeason) {
			                                        if (data[2].length == 0) { break; } else { body +=
			                                        	'<tr>' +
			                                                '<td>'+ data[2][i].gs_week + '</td>' +
			                                                '<td><a href="http://mlultimate.com/boxscore/?ga=' + data[2][i].gs_game_id_fk + '">'+ data[2][i].Date + '</a></td>' +
			                                                '<td>'+ data[2][i].gs_opponent + '</td>' +
			                                                '<td>'+ data[2][i].gs_catches + '</td>' +
			                                                '<td>'+ data[2][i].gs_bookends + '</td>' +
			                                                '<td>'+ data[2][i].gs_callahans + '</td>' +
			                                                '<td>'+ data[2][i].gs_o_points_played + '</td>' +
			                                                '<td>'+ data[2][i].gs_d_points_played + '</td>' +
			                                                '<td>'+ data[2][i].gs_hockey_assists + '</td>' +
			                                            '</tr>';
			                                        };
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
	                    	'</div>' +
	                	'</div>' +
	            	'</div>' +
	            	'<div id="seasonTotal" class="season box total">' +
	                	'<div id="subtabs2" class="subtabs">' +
		                    '<ul class="subtab-links">' +
		                        '<li class="active"><a href="#subtab21">Overview</a></li>' +
		                        '<li><a href="#subtab22">Percentages</a></li>' +
		                        '<li><a href="#subtab23">Fouls/Turns</a></li>' +
		                        '<li><a href="#subtab24">Miscellaneous</a></li>' +
		                    '</ul>' +
		                    '<div class="subtab-content">' +
		                        '<div id="subtab21" class="subtab active">' +
		                            '<table id="pl-statbox-basic-season" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Season">SE</th>' +
		                                    '<th title="Goals">G</th>' +
		                                    '<th title="Assists">A</th>' +
		                                    '<th title="Blocks">B</th>' +
		                                    '<th title="Points Played">PP</th>' +
		                                    '<th title="Completions">COMP</th>' +
		                                    '<th class="hideSmall" title="Throws">THR</th>' +
		                                    '<th title="Completion Percentage">COMP%</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                '</thead>' +
		                                '<tbody>';
		                                	for (var i = 0; i < data[3].length; i++) {
			                                    if(data[3][i].gs_game_type !== 3) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[3][i].se_year + '</td>' +
			                                            '<td>'+ data[3][i].ss_goals + '</td>' +
			                                            '<td>'+ data[3][i].ss_assists + '</td>' +
			                                            '<td>'+ data[3][i].ss_blocks + '</td>' +
			                                            '<td>'+ data[3][i].ss_points_played + '</td>' +
			                                            '<td>'+ data[3][i].ss_completions + '</td>' +
			                                            '<td class="hideSmall">'+ data[3][i].ss_throws + '</td>' +
			                                            '<td>'+ data[3][i].ss_completion_percentage + '%</td>' +
			                                            '<td>'+ data[3][i].ss_turnovers + '</td>' +
			                                        '</tr>';
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab22" class="subtab">' +
		                            '<table id="pl-statbox-percentage-season" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Season">SE</th>' +
		                                    '<th title="Completion Percentage">COMP%</th>' +
		                                    '<th title="Offensive Scoring Efficiency">OSE</th>' +
		                                    '<th title="Defensive Scoring Efficiency">DSE</th>' +
		                                    '<th title="Defensive Turnover Efficiency">DTE</th>' +
		                                    '<th title="Defensive Turnover Scoring Efficiency">DTSE</th>' +
		                                    '<th title="Touches per Offensive Possession">TPOP</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[3].length; i++) {
			                                    if(data[3][i].gs_game_type !== 3) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[3][i].se_year + '</td>' +
			                                            '<td>'+ data[3][i].ss_completion_percentage + '%</td>' +
			                                            '<td>'+ data[3][i].ss_ose + '%</td>' +
			                                            '<td>'+ data[3][i].ss_dse + '%</td>' +
			                                            '<td>'+ data[3][i].ss_dte + '%</td>' +
			                                            '<td>'+ data[3][i].ss_dtse + '%</td>' +
			                                            '<td>'+ data[3][i].ss_tpop + '</td>' +
			                                        '</tr>';
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab23" class="subtab">' +
		                            '<table id="pl-statbox-advanced-season" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Season">SE</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                    '<th title="Fouls">F</th>' +
		                                    '<th title="Travels">Tr</th>' +
		                                    '<th title="Stalls">St</th>' +
		                                    '<th title="Throwaways">TA</th>' +
		                                    '<th title="Throws into Blocks">TiB</th>' +
		                                    '<th title="Drops">D</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[3].length; i++) {
			                                    if(data[3][i].gs_game_type !== 3) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[3][i].se_year + '</td>' +
			                                            '<td>'+ data[3][i].ss_turnovers + '</td>' +
			                                            '<td>'+ data[3][i].ss_fouls + '</td>' +
			                                            '<td>'+ data[3][i].ss_travels + '</td>' +
			                                            '<td>'+ data[3][i].ss_stalls + '</td>' +
			                                            '<td>'+ data[3][i].ss_throw_aways + '</td>' +
			                                            '<td>'+ data[3][i].ss_throw_into_blocks + '</td>' +
			                                            '<td>'+ data[3][i].ss_drops + '</td>' +
			                                        '</tr>';
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab24" class="subtab">' +
		                            '<table id="pl-statbox-extra-season" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Season">SE</th>' +
		                                    '<th title="Catches">C</th>' +
		                                    '<th title="Bookends">BE</th>' +
		                                    '<th title="Callahans">Call</th>' +
		                                    '<th title="Offensive Points Played">O-PP</th>' +
		                                    '<th title="Defensive Points Played">D-PP</th>' +
		                                    '<th title="Hockey Assists">HA</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[3].length; i++) {
			                                    if(data[3][i].gs_game_type !== 3) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[3][i].se_year + '</td>' +
			                                            '<td>'+ data[3][i].ss_catches + '</td>' +
			                                            '<td>'+ data[3][i].ss_bookends + '</td>' +
			                                            '<td>'+ data[3][i].ss_callahans + '</td>' +
			                                            '<td>'+ data[3][i].ss_o_points_played + '</td>' +
			                                            '<td>'+ data[3][i].ss_d_points_played + '</td>' +
			                                            '<td>'+ data[3][i].ss_hockey_assists + '</td>' +
			                                        '</tr>'
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
	                    	'</div>' +
	                	'</div>' +
	            	'</div>' +
	            	'<div id="seasonAverage" class="season box average">' +
	                	'<div id="averagesubtabs2" class="subtabs">' +
		                    '<ul class="subtab-links">' +
		                        '<li class="active"><a href="#averagesubtab21">Overview</a></li>' +
		                        '<li><a href="#averagesubtab23">Fouls/Turns</a></li>' +
		                        '<li><a href="#averagesubtab24">Miscellaneous</a></li>' +
		                    '</ul>' +
		                    '<div class="subtab-content">' +
		                        '<div id="averagesubtab21" class="subtab active">' +
		                            '<table id="average-pl-statbox-basic-season" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Season">SE</th>' +
		                                    '<th title="Games Played">GP</th>' +
		                                    '<th title="Goals">G</th>' +
		                                    '<th title="Assists">A</th>' +
		                                    '<th title="Blocks">B</th>' +
		                                    '<th title="Points Played">PP</th>' +
		                                    '<th title="Completions">COMP</th>' +
		                                    '<th class="hideSmall" title="Throws">THR</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[4].length; i++) {
			                                    if(data[4][i].gs_game_type !== 4) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[4][i].se_year + '</td>' +
			                                            '<td>'+ data[4][i].sa_games_played + '</td>' +
			                                            '<td>'+ data[4][i].sa_goals + '</td>' +
			                                            '<td>'+ data[4][i].sa_assists + '</td>' +
			                                            '<td>'+ data[4][i].sa_blocks + '</td>' +
			                                            '<td>'+ data[4][i].sa_points_played + '</td>' +
			                                            '<td>'+ data[4][i].sa_completions + '</td>' +
			                                            '<td class="hideSmall">'+ data[4][i].sa_throws + '</td>' +
			                                            '<td>'+ data[4][i].sa_turnovers + '</td>' +
			                                        '</tr>';
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="averagesubtab23" class="subtab">' +
		                            '<table id="average-pl-statbox-advanced-season" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Season">SE</th>' +
		                                    '<th title="Games Played">GP</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                    '<th title="Fouls">F</th>' +
		                                    '<th title="Travels">Tr</th>' +
		                                    '<th title="Stalls">St</th>' +
		                                    '<th title="Throwaways">TA</th>' +
		                                    '<th title="Throws into Blocks">TiB</th>' +
		                                    '<th title="Drops">D</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[4].length; i++) {
			                                    if(data[4][i].gs_game_type !== 4) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[4][i].se_year + '</td>' +
			                                            '<td>'+ data[4][i].sa_games_played + '</td>' +
			                                            '<td>'+ data[4][i].sa_turnovers + '</td>' +
			                                            '<td>'+ data[4][i].sa_fouls + '</td>' +
			                                            '<td>'+ data[4][i].sa_travels + '</td>' +
			                                            '<td>'+ data[4][i].sa_stalls + '</td>' +
			                                            '<td>'+ data[4][i].sa_throw_aways + '</td>' +
			                                            '<td>'+ data[4][i].sa_throw_into_blocks + '</td>' +
			                                            '<td>'+ data[4][i].sa_drops + '</td>' +
			                                        '</tr>';
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="averagesubtab24" class="subtab">' +
		                            '<table id="average-pl-statbox-extra-season" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Season">SE</th>' +
		                                    '<th title="Games Played">GP</th>' +
		                                    '<th title="Catches">C</th>' +
		                                    '<th title="Bookends">BE</th>' +
		                                    '<th title="Callahans">Call</th>' +
		                                    '<th title="Offensive Points Played">O-PP</th>' +
		                                    '<th title="Defensive Points Played">D-PP</th>' +
		                                    '<th title="Hockey Assists">HA</th>' +
		                                '</thead>' +
		                                '<tbody>';
			                                for (var i = 0; i < data[4].length; i++) {
			                                    if(data[4][i].gs_game_type !== 4) { body +=
			                                    	'<tr>' +
			                                            '<td>'+ data[4][i].se_year + '</td>' +
			                                            '<td>'+ data[4][i].sa_games_played + '</td>' +
			                                            '<td>'+ data[4][i].sa_catches + '</td>' +
			                                            '<td>'+ data[4][i].sa_bookends + '</td>' +
			                                            '<td>'+ data[4][i].sa_callahans + '</td>' +
			                                            '<td>'+ data[4][i].sa_o_points_played + '</td>' +
			                                            '<td>'+ data[4][i].sa_d_points_played + '</td>' +
			                                            '<td>'+ data[4][i].sa_hockey_assists + '</td>' +
			                                        '</tr>';
			                                    };
			                                }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
	                    	'</div>' +
	                	'</div>' +
	            	'</div>' +
	            	'<div id="careerRegularTotal" class="careerRegular box total">' +
	                	'<div id="subtabs3" class="subtabs">' +
		                    '<ul class="subtab-links">' +
		                        '<li class="active"><a href="#subtab31">Overview</a></li>' +
		                        '<li><a href="#subtab32">Percentages</a></li>' +
		                        '<li><a href="#subtab33">Fouls/Turns</a></li>' +
		                        '<li><a href="#subtab34">Miscellaneous</a></li>' +
		                    '</ul>' +
	                    	'<div class="subtab-content">' +
		                        '<div id="subtab31" class="subtab active">' +
		                            '<table id="pl-statbox-basic-careerRegular" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Goals">G</th>' +
		                                    '<th title="Assists">A</th>' +
		                                    '<th title="Blocks">B</th>' +
		                                    '<th title="Points Played">PP</th>' +
		                                    '<th title="Completions">COMP</th>' +
		                                    '<th class="hideSmall" title="Throws">THR</th>' +
		                                    '<th title="Completion Percentage">COMP%</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                '</thead>' +
		                                '<tbody>' +
		                                    '<tr>' +
		                                        '<td>' + data[5][0].ct_goals + '</td>' +
		                                        '<td>' + data[5][0].ct_assists + '</td>' +
		                                        '<td>' + data[5][0].ct_blocks + '</td>' +
		                                        '<td>' + data[5][0].ct_points_played + '</td>' +
		                                        '<td>' + data[5][0].ct_completions + '</td>' +
		                                        '<td class="hideSmall">' + data[5][0].ct_throws + '</td>' +
		                                        '<td>' + data[5][0].ct_completion_percentage + '%</td>' +
		                                        '<td>' + data[5][0].ct_turnovers + '</td>' +
		                                    '</tr>' +
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab32" class="subtab">' +
		                            '<table id="pl-statbox-percentage-careerRegular" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Completion Percentage">COMP%</th>' +
		                                    '<th title="Offensive Scoring Efficiency">OSE</th>' +
		                                    '<th title="Defensive Scoring Efficiency">DSE</th>' +
		                                    '<th title="Defensive Turnover Efficiency">DTE</th>' +
		                                    '<th title="Defensive Turnover Scoring Efficiency">DTSE</th>' +
		                                    '<th title="Touches per Offensive Possession">TPOP</th>' +
		                                '</thead>' +
		                                '<tbody>' +
		                                    '<tr>' +
		                                        '<td>'+ data[5][0].ct_completion_percentage + '%</td>' +
		                                        '<td>'+ data[5][0].ct_ose + '%</td>' +
		                                        '<td>'+ data[5][0].ct_dse + '%</td>' +
		                                        '<td>'+ data[5][0].ct_dte + '%</td>' +
		                                        '<td>'+ data[5][0].ct_dtse + '%</td>' +
		                                        '<td>'+ data[5][0].ct_tpop + '</td>' +
		                                    '</tr>' +
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab33" class="subtab">' +
		                            '<table id="pl-statbox-advanced-careerRegular" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Turnovers">T</th>' +
		                                    '<th title="Fouls">F</th>' +
		                                    '<th title="Travels">Tr</th>' +
		                                    '<th title="Stalls">St</th>' +
		                                    '<th title="Throwaways">TA</th>' +
		                                    '<th title="Throws into Blocks">TiB</th>' +
		                                    '<th title="Drops">D</th>' +
		                                '</thead>' +
		                                '<tbody>' +
		                                    '<tr>' +
		                                        '<td>'+ data[5][0].ct_turnovers + '</td>' +
		                                        '<td>'+ data[5][0].ct_fouls + '</td>' +
		                                        '<td>'+ data[5][0].ct_travels + '</td>' +
		                                        '<td>'+ data[5][0].ct_stalls + '</td>' +
		                                        '<td>'+ data[5][0].ct_throw_aways + '</td>' +
		                                        '<td>'+ data[5][0].ct_throw_into_blocks + '</td>' +
		                                        '<td>'+ data[5][0].ct_drops + '</td>' +
		                                    '</tr>' +
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab34" class="subtab">' +
		                            '<table id="pl-statbox-extra-careerRegular" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Catches">C</th>' +
		                                    '<th title="Bookends">BE</th>' +
		                                    '<th title="Callahans">Call</th>' +
		                                    '<th title="Offensive Points Played">O-PP</th>' +
		                                    '<th title="Defensive Points Played">D-PP</th>' +
		                                    '<th title="Hockey Assists">HA</th>' +
		                                '</thead>' +
		                                '<tbody>' +
		                                    '<tr>' +
		                                        '<td>'+ data[5][0].ct_catches + '</td>' +
		                                        '<td>'+ data[5][0].ct_bookends + '</td>' +
		                                        '<td>'+ data[5][0].ct_callahans + '</td>' +
		                                        '<td>'+ data[5][0].ct_o_points_played + '</td>' +
		                                        '<td>'+ data[5][0].ct_d_points_played + '</td>' +
		                                        '<td>'+ data[5][0].ct_hockey_assists + '</td>' +
		                                    '</tr>' +
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
	                    	'</div>' +
	                	'</div>' +
	            	'</div>' +
	            	'<div id="careerRegularAverage" class="careerRegular box average">' +
	                	'<div id="subtabs3" class="subtabs">' +
		                    '<ul class="subtab-links">' +
		                        '<li class="active"><a href="#averagesubtab31">Overview</a></li>' +
		                        '<li><a href="#averagesubtab33">Fouls/Turns</a></li>' +
		                        '<li><a href="#averagesubtab34">Miscellaneous</a></li>' +
		                    '</ul>' +
	                    	'<div class="subtab-content">' +
		                        '<div id="averagesubtab31" class="subtab active">' +
		                            '<table id="pl-statbox-basic-careerRegular" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Games Played">GP</th>' +
		                                    '<th title="Goals">G</th>' +
		                                    '<th title="Assists">A</th>' +
		                                    '<th title="Blocks">B</th>' +
		                                    '<th title="Points Played">PP</th>' +
		                                    '<th title="Completions">COMP</th>' +
		                                    '<th class="hideSmall" title="Throws">THR</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                '</thead>' +
		                                '<tbody>' +
		                                    '<tr>' +
		                                        '<td>' + data[6][0].ca_games_played + '</td>' +
		                                        '<td>' + data[6][0].ca_goals + '</td>' +
		                                        '<td>' + data[6][0].ca_assists + '</td>' +
		                                        '<td>' + data[6][0].ca_blocks + '</td>' +
		                                        '<td>' + data[6][0].ca_points_played + '</td>' +
		                                        '<td>' + data[6][0].ca_completions + '</td>' +
		                                        '<td class="hideSmall">' + data[6][0].ca_throws + '</td>' +
		                                        '<td>' + data[6][0].ca_turnovers + '</td>' +
		                                    '</tr>' +
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="averagesubtab33" class="subtab">' +
		                            '<table id="pl-statbox-advanced-careerRegular" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Games Played">GP</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                    '<th title="Fouls">F</th>' +
		                                    '<th title="Travels">Tr</th>' +
		                                    '<th title="Stalls">St</th>' +
		                                    '<th title="Throwaways">TA</th>' +
		                                    '<th title="Throws into Blocks">TiB</th>' +
		                                    '<th title="Drops">D</th>' +
		                                '</thead>' +
		                                '<tbody>' +
		                                    '<tr>' +
		                                        '<td>' + data[6][0].ca_games_played + '</td>' +
		                                        '<td>' + data[6][0].ca_turnovers + '</td>' +
		                                        '<td>' + data[6][0].ca_fouls + '</td>' +
		                                        '<td>' + data[6][0].ca_travels + '</td>' +
		                                        '<td>' + data[6][0].ca_stalls + '</td>' +
		                                        '<td>' + data[6][0].ca_throw_aways + '</td>' +
		                                        '<td>' + data[6][0].ca_throw_into_blocks + '</td>' +
		                                        '<td>' + data[6][0].ca_drops + '</td>' +
		                                    '</tr>' +
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="averagesubtab34" class="subtab">' +
		                            '<table id="pl-statbox-extra-careerRegular" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Games Played">GP</th>' +
		                                    '<th title="Catches">C</th>' +
		                                    '<th title="Bookends">BE</th>' +
		                                    '<th title="Callahans">Call</th>' +
		                                    '<th title="Offensive Points Played">O-PP</th>' +
		                                    '<th title="Defensive Points Played">D-PP</th>' +
		                                    '<th title="Hockey Assists">HA</th>' +
		                                '</thead>' +
		                                '<tbody>' +
		                                    '<tr>' +
		                                        '<td>' + data[6][0].ca_games_played + '</td>' +
		                                        '<td>' + data[6][0].ca_catches + '</td>' +
		                                        '<td>' + data[6][0].ca_bookends + '</td>' +
		                                        '<td>' + data[6][0].ca_callahans + '</td>' +
		                                        '<td>' + data[6][0].ca_o_points_played + '</td>' +
		                                        '<td>' + data[6][0].ca_d_points_played + '</td>' +
		                                        '<td>' + data[6][0].ca_hockey_assists + '</td>' +
		                                    '</tr>' +
		                                '</tbody>' +
		                            '</table>' +
	                	        '</div>' +
	                    	'</div>' +
	                	'</div>' +
	            	'</div>' +
	            	'<div id="careerPostTotal" class="careerPost box total">' +
	                	'<div id="subtabs3" class="subtabs">' +
		                    '<ul class="subtab-links">' +
		                        '<li class="active"><a href="#subtab31">Overview</a></li>' +
		                        '<li><a href="#subtab32">Percentages</a></li>' +
		                        '<li><a href="#subtab33">Fouls/Turns</a></li>' +
		                        '<li><a href="#subtab34">Miscellaneous</a></li>' +
		                    '</ul>' +
	                    	'<div class="subtab-content">' +
		                        '<div id="subtab31" class="subtab active">' +
		                            '<table id="pl-statbox-basic-careerPost" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Goals">G</th>' +
		                                    '<th title="Assists">A</th>' +
		                                    '<th title="Blocks">B</th>' +
		                                    '<th title="Points Played">PP</th>' +
		                                    '<th title="Completions">COMP</th>' +
		                                    '<th class="hideSmall" title="Throws">THR</th>' +
		                                    '<th title="Completion Percentage">COMP%</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                '</thead>' +
		                                '<tbody>';
		                                    for (var i = 0; i < data[7].length; i++) {
		                                        if (data[7].length == 0) { break; } else { body +=
		                                        	'<tr>' +
		                                                '<td>' + data[7][0].pt_goals + '</td>' +
		                                                '<td>' + data[7][0].pt_assists + '</td>' +
		                                                '<td>' + data[7][0].pt_blocks + '</td>' +
		                                                '<td>' + data[7][0].pt_points_played + '</td>' +
		                                                '<td>' + data[7][0].pt_completions + '</td>' +
		                                                '<td class="hideSmall">' + data[7][0].pt_throws + '</td>' +
		                                                '<td>' + data[7][0].pt_completion_percentage + '%</td>' +
		                                                '<td>' + data[7][0].pt_turnovers + '</td>' +
		                                            '</tr>';
		                                        };
		                                    }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab32" class="subtab">' +
		                            '<table id="pl-statbox-percentage-careerPost" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Completion Percentage">COMP%</th>' +
		                                    '<th title="Offensive Scoring Efficiency">OSE</th>' +
		                                    '<th title="Defensive Scoring Efficiency">DSE</th>' +
		                                    '<th title="Defensive Turnover Efficiency">DTE</th>' +
		                                    '<th title="Defensive Turnover Scoring Efficiency">DTSE</th>' +
		                                    '<th title="Touches per Offensive Possession">TPOP</th>' +
		                                '</thead>' +
		                                '<tbody>';
		                                    for (var i = 0; i < data[7].length; i++) {
		                                        if (data[7].length == 0) { break; } else { body +=
		                                        	'<tr>' +
		                                                '<td>'+ data[7][0].pt_completion_percentage + '%</td>' +
		                                                '<td>'+ data[7][0].pt_ose + '%</td>' +
		                                                '<td>'+ data[7][0].pt_dse + '%</td>' +
		                                                '<td>'+ data[7][0].pt_dte + '%</td>' +
		                                                '<td>'+ data[7][0].pt_dtse + '%</td>' +
		                                                '<td>'+ data[7][0].pt_tpop + '</td>' +
		                                            '</tr>';
		                                        };
		                                    }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab33" class="subtab">' +
		                            '<table id="pl-statbox-advanced-careerPost" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Turnovers">T</th>' +
		                                    '<th title="Fouls">F</th>' +
		                                    '<th title="Travels">Tr</th>' +
		                                    '<th title="Stalls">St</th>' +
		                                    '<th title="Throwaways">TA</th>' +
		                                    '<th title="Throws into Blocks">TiB</th>' +
		                                    '<th title="Drops">D</th>' +
		                                '</thead>' +
		                                '<tbody>';
		                                    for (var i = 0; i < data[7].length; i++) {
		                                        if (data[7].length == 0) { break; } else { body +=
		                                        	'<tr>' +
		                                                '<td>'+ data[7][0].pt_turnovers + '</td>' +
		                                                '<td>'+ data[7][0].pt_fouls + '</td>' +
		                                                '<td>'+ data[7][0].pt_travels + '</td>' +
		                                                '<td>'+ data[7][0].pt_stalls + '</td>' +
		                                                '<td>'+ data[7][0].pt_throw_aways + '</td>' +
		                                                '<td>'+ data[7][0].pt_throw_into_blocks + '</td>' +
		                                                '<td>'+ data[7][0].pt_drops + '</td>' +
		                                            '</tr>';
		                                        };
		                                    }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="subtab34" class="subtab">' +
		                            '<table id="pl-statbox-extra-careerPost" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Catches">C</th>' +
		                                    '<th title="Bookends">BE</th>' +
		                                    '<th title="Callahans">Call</th>' +
		                                    '<th title="Offensive Points Played">O-PP</th>' +
		                                    '<th title="Defensive Points Played">D-PP</th>' +
		                                    '<th title="Hockey Assists">HA</th>' +
		                                '</thead>' +
		                                '<tbody>';
		                                    for (var i = 0; i < data[7].length; i++) {
		                                        if (data[7].length == 0) { break; } else { body +=
		                                        	'<tr>' +
		                                                '<td>'+ data[7][0].pt_catches + '</td>' +
		                                                '<td>'+ data[7][0].pt_bookends + '</td>' +
		                                                '<td>'+ data[7][0].pt_callahans + '</td>' +
		                                                '<td>'+ data[7][0].pt_o_points_played + '</td>' +
		                                                '<td>'+ data[7][0].pt_d_points_played + '</td>' +
		                                                '<td>'+ data[7][0].pt_hockey_assists + '</td>' +
		                                            '</tr>';
		                                        };
		                                    }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
	                    	'</div>' +
	                	'</div>' +
	            	'</div>' +
	            	'<div id="careerPostAverage" class="careerPost box average">' +
	                	'<div id="subtabs3" class="subtabs">' +
		                    '<ul class="subtab-links">' +
		                        '<li class="active"><a href="#averagesubtab31">Overview</a></li>' +
		                        '<li><a href="#averagesubtab33">Fouls/Turns</a></li>' +
		                        '<li><a href="#averagesubtab34">Miscellaneous</a></li>' +
		                    '</ul>' +
	                    	'<div class="subtab-content">' +
		                        '<div id="averagesubtab31" class="subtab active">' +
		                            '<table id="pl-statbox-basic-careerPost" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Games Played">GP</th>' +
		                                    '<th title="Goals">G</th>' +
		                                    '<th title="Assists">A</th>' +
		                                    '<th title="Blocks">B</th>' +
		                                    '<th title="Points Played">PP</th>' +
		                                    '<th title="Completions">COMP</th>' +
		                                    '<th class="hideSmall" title="Throws">THR</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                '</thead>' +
		                                '<tbody>';
		                                    for (var i = 0; i < data[8].length; i++) {
		                                        if (data[8].length == 0) { break; } else { body +=
		                                        	'<tr>' +
		                                                '<td>' + data[8][0].pa_games_played + '</td>' +
		                                                '<td>' + data[8][0].pa_goals + '</td>' +
		                                                '<td>' + data[8][0].pa_assists + '</td>' +
		                                                '<td>' + data[8][0].pa_blocks + '</td>' +
		                                                '<td>' + data[8][0].pa_points_played + '</td>' +
		                                                '<td>' + data[8][0].pa_completions + '</td>' +
		                                                '<td class="hideSmall">' + data[8][0].pa_throws + '</td>' +
		                                                '<td>' + data[8][0].pa_turnovers + '</td>' +
		                                            '</tr>';
		                                        };
		                                    }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="averagesubtab33" class="subtab">' +
		                            '<table id="pl-statbox-advanced-careerPost" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Games Played">GP</th>' +
		                                    '<th title="Turnovers">T</th>' +
		                                    '<th title="Fouls">F</th>' +
		                                    '<th title="Travels">Tr</th>' +
		                                    '<th title="Stalls">St</th>' +
		                                    '<th title="Throwaways">TA</th>' +
		                                    '<th title="Throws into Blocks">TiB</th>' +
		                                    '<th title="Drops">D</th>' +
		                                '</thead>' +
		                                '<tbody>';
		                                    for (var i = 0; i < data[8].length; i++) {
		                                        if (data[8].length == 0) { break; } else { body +=
		                                        	'<tr>' +
		                                                '<td>' + data[8][0].pa_games_played + '</td>' +
		                                                '<td>' + data[8][0].pa_turnovers + '</td>' +
		                                                '<td>' + data[8][0].pa_fouls + '</td>' +
		                                                '<td>' + data[8][0].pa_travels + '</td>' +
		                                                '<td>' + data[8][0].pa_stalls + '</td>' +
		                                                '<td>' + data[8][0].pa_throw_aways + '</td>' +
		                                                '<td>' + data[8][0].pa_throw_into_blocks + '</td>' +
		                                                '<td>' + data[8][0].pa_drops + '</td>' +
		                                            '</tr>';
		                                        };
		                                    }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
		                        '<div id="averagesubtab34" class="subtab">' +
		                            '<table id="pl-statbox-extra-careerPost" class="stat-table stat-table--small">' +
		                                '<thead>' +
		                                    '<th title="Games Played">GP</th>' +
		                                    '<th title="Catches">C</th>' +
		                                    '<th title="Bookends">BE</th>' +
		                                    '<th title="Callahans">Call</th>' +
		                                    '<th title="Offensive Points Played">O-PP</th>' +
		                                    '<th title="Defensive Points Played">D-PP</th>' +
		                                    '<th title="Hockey Assists">HA</th>' +
		                                '</thead>' +
		                                '<tbody>';
		                                    for (var i = 0; i < data[8].length; i++) {
		                                        if (data[8].length == 0) { break; } else { body +=
		                                        	'<tr>' +
		                                                '<td>' + data[8][0].pa_games_played + '</td>' +
		                                                '<td>' + data[8][0].pa_catches + '</td>' +
		                                                '<td>' + data[8][0].pa_bookends + '</td>' +
		                                                '<td>' + data[8][0].pa_callahans + '</td>' +
		                                                '<td>' + data[8][0].pa_o_points_played + '</td>' +
		                                                '<td>' + data[8][0].pa_d_points_played + '</td>' +
		                                                '<td>' + data[8][0].pa_hockey_assists + '</td>' +
		                                            '</tr>';
		                                        };
		                                    }; body +=
		                                '</tbody>' +
		                            '</table>' +
		                        '</div>' +
	                    	'</div>' +
	                	'</div>' +
	            	'</div>' +
	        	'</div>';
	        $('.sk-fading-circle').hide();    
	        $('#playerPageBody').html(body);
	        $("#seasonPick").val(currentSeason);
	    };

	    function processNewPlayerCard(data) {
	        var head = 
	        	'<a href="http://mlultimate.com/player-statistics-2/">>>> See All</a>' +
	            '<p class="player-team-header" style="background-color: ' + data[0][0].TeamColor + ';"><span class="player-team-header-name hideSmall">' + data[0][0].TeamCity + ' ' + data[0][0].Team + '</span><span class="player-team-header-name showBig">' + data[0][0].TeamCity + '</br>' + data[0][0].Team + '</span></p>' +
	            '<div id="headDivforPlayer">' +
	                '<div class="module-unit player-info-img"><img src="';
		                if(data[0][0].pic_path == null) {
		                    head += '//fantasy.mlultimate.com/img/players/default_player.png';
		                } else {
		                    head += data[0][0].pic_path;
		                }; head += '">' +
		            '</div>' +
	                '<div class="module-unit player-info">' +
	                    '<div class="player-info--person">' +
	                        '<h4 class="player-info--name">' + data[0][0].FirstName + ' ' + data[0][0].LastName + '</h4>';
	                        if(data[0][0].Twitter == null) {} else { head += '<p class="player-info--soc"><strong>Twitter:</strong> <a href="https://twitter.com/' + data[0][0].Twitter + '" target="_blank">' + data[0][0].Twitter + '</a></p>';}; head +=
	                        '<p class="player-info--num">#' + data[0][0].Number + ' - ' + data[0][0].Position + '</p>' +
	                    '</div>' +
	                    '<div class="player-info--meta">' +
	                        '<p class="player-info-meta"><strong>Height:</strong> ' + data[0][0].Height + ' <strong>Weight:</strong> ' + data[0][0].Weight + ' <strong>Age:</strong> ' + data[0][0].Age + '</p>' +
	                        '<p class="player-info-meta"><strong>College:</strong> ' + data[0][0].College + '</p>' +
	                        '<p class="player-info-meta"><strong>MLU Experience:</strong> ' + data[0][0].Experience + '</p>' +
	                        '<p class="player-info-meta"><strong>High School:</strong> ' + data[0][0].highschool + '</p>' +
	                    '</div>' +
	                '</div>' +
	                '<div class="module-unit player-stats">' +
	                '</div>' +
	            '</div>';
	        $('.sk-fading-circle').hide();  
	        $('#playerPageHead').html(head);
	    };
	// End Create Player Card

	// Extras
	    function hideData() {
	        $('.postSeason').hide();
	        $('.season').hide();
	        $('.careerRegular').hide();
	        $('.careerPost').hide();
	        $('.regularSeason.postSeason').show();
	    };
	    var extrasPlayerCard = function() {
		    $(document).on('click', '.subtabs .subtab-links a', function(e2) {
		        var currentAttrValue2 = $(e2.target).attr('href');
		        $('.subtabs ' + currentAttrValue2).show().siblings().hide();
		        $(e2.target).parent('li').addClass('active').siblings().removeClass('active');
		        e2.preventDefault();
		    });
		    $(document).on('change', '#dataType', function() {
		        var vale = $('#dataType').val();
		        $('.box').hide();
		        $('#dataPick').val('total');
		        $('#seasonAverage').hide();
		        $('.' + vale + '.total').show();
		    });
		    $(document).on('change', '#seasonPick', function() {
		        var vale = $('#seasonPick').val();
		        processPlayerCard(playerDatar, vale);
		        hideData();
		    });
		    $(document).on('change', '#dataPick', function() {
		        var vale = $('#dataPick').val();
		        if ($('#dataType').val() == "season") {
		            if (vale == "total") {
		                $('#seasonTotal').show();
		                $('#seasonAverage').hide();
		            } else if (vale == "average") {
		                $('#seasonAverage').show();
		                $('#seasonTotal').hide();
		            };
		        } else if ($('#dataType').val() == "careerRegular") {
		            if (vale == "total") {
		                $('#careerRegularTotal').show();
		                $('#careerRegularAverage').hide();
		            } else if (vale == "average") {
		                $('#careerRegularAverage').show();
		                $('#careerRegularTotal').hide();
		            };
		        } else if ($('#dataType').val() == "careerPost") {
		            if (vale == "total") {
		                $('#careerPostTotal').show();
		                $('#careerPostAverage').hide();
		            } else if (vale == "average") {
		                $('#careerPostAverage').show();
		                $('#careerPostTotal').hide();
		            };
		        };
		    });
		};
	// End Extras
// END PLAYER CARD

// PLAYER COMPARE
	// Picking Data and Setup
		$(document).ready(function() {
		    if($('#pcomp-container').length) {
			    getStatsPlayerComparePicker();
			    extrasPlayerCompare();
		    };
		});
		var playerIdOne; //ID of first player selected
		var playerIdTwo; //ID of second player selected
		var yearPickerOne = 4; //What year to select the players from for player 1
		var yearPickerTwo = 4; //What year to select the players from for player 2
		var allOptionsOne = ''; //Var to hold info filtering players on teams
		var allOptionsTwo = ''; //Var to hold info filtering players on teams
		var isPlayerOne = 0; //Var to say whether a player 1 has been selected or not: 0 (no), 1 (yes)
		var isPlayerTwo = 0; //Var to say whether a player 2 has been selected or not: 0 (no), 1 (yes)
		var statType = 2; //What type of stat to use: 1 (total), 2 (average) for player 1
		var statTypeTwo = parseInt(statType) + 7; //What tyoe of stat to use : 8 (total), 9 (average) for player 2
		var timeType = 1; //What type of time to use: 1 (season), -1 (career) for player 1
		var currentPlayerOneTeam;
		var currentPlayerTwoTeam;
		var getStatsPlayerComparePicker = function() {
		    $.ajax({
		        url:"http://mlustats.herokuapp.com/api/v1/players?sid=4&tid=0",
		        type:"get",
		        success:function(data){
			        processStatsPlayerComparePicker(data[0]);
		        }
		    });
		};
	// End Picking Data and Setup

	//Create the Player Picker
		var processStatsPlayerComparePicker = function(data) { var pickers =
	      	'<div class="pcomp-pickerContainer">' +
	        	'<div class="pcomp-pickerContainerPlayer fleft">' +
	          		'<div class="pcomp-selectors tleft">' +
	            		'<select class="pcomp-playerOneYear">' +
			            	'<option value="4">2016</option>' +
			            	'<option value="3">2015</option>' +
			            	'<option value="2">2014</option>' +
			            	'<option value="1">2013</option>' +
			            '</select>' +
			            '<select class="pcomp-playerOneTeam">' +
			            	'<option value="0"> --Select a Team-- </option>' +
			            	'<option class="BOS" value="3">Boston</option>' +
			            	'<option class="NY" value="2">New York</option>' +
			            	'<option class="PHL" value="1">Philadelphia</option>' +
			            	'<option class="DC" value="4">Washington DC</option>' +
			            	'<option class="POR" value="5">Portland</option>' +
			            	'<option class="SF" value="7">San Francisco</option>' +
			            	'<option class="SEA" value="6">Seattle</option>' +
			            	'<option class="VAN" value="8">Vancouver</option>' +
			            '</select>' +
	            		'<select class="pcomp-playerOne">' +
	              			'<option class="selectors BOS NY PHL DC POR SF SEA VAN" value="0"> --Select a Player-- </option>';
	              			for (var i = 0; i < data.length; i++) {	pickers += 
	                			'<option value="' + data[i].PlayerID + '" class="selectors ' + data[i].ShortTeam + '">' + data[i].Name + '</option>';
	              			}; pickers += 
	            		'</select>' +
	          		'</div>' + //End Selectors
		          	'<div class="pcomp-playerInfo playerOne"><img class="pcomp-playerImg fright" src="http://fantasy.mlultimate.com/img/players/default_player.png"></div>' + //End Player Info
		        '</div>' + //End Container Left
		        '<div class="pcomp-pickerContainerPlayer fright">' +
		          	'<div class="pcomp-selectors tright">' +
		            	'<select class="pcomp-playerTwoYear">' +
				            '<option value="4">2016</option>' +
				            '<option value="3">2015</option>' +
				            '<option value="2">2014</option>' +
				            '<option value="1">2013</option>' +
			            '</select>' +
			            '<select class="pcomp-playerTwoTeam">' +
		            		'<option value="0"> --Select a Team-- </option>' +
		            		'<option class="BOS" value="3">Boston</option>' +
		            		'<option class="NY" value="2">New York</option>' +
		            		'<option class="PHL" value="1">Philadelphia</option>' +
		            		'<option class="DC" value="4">Washington DC</option>' +
		            		'<option class="POR" value="5">Portland</option>' +
		            		'<option class="SF" value="7">San Francisco</option>' +
		            		'<option class="SEA" value="6">Seattle</option>' +
		            		'<option class="VAN" value="8">Vancouver</option>' +
			            '</select>' +
			            '<select class="pcomp-playerTwo">' +
		              		'<option class="selectors BOS NY PHL DC POR SF SEA VAN" value="0"> --Select a Player-- </option>';
				            for (var i = 0; i < data.length; i++) { pickers += 
				            	'<option value="' + data[i].PlayerID + '" class="selectors ' + data[i].ShortTeam + '">' + data[i].Name + '</option>';
				            }; pickers += 
				        '</select>' +
		          	'</div>' + //End Selectors
		          	'<div class="pcomp-playerInfo playerTwo"><img class="pcomp-playerImg fleft" src="http://fantasy.mlultimate.com/img/players/default_player.png"></div>' + //End Player Info
		        '</div>' + //End Container Right
		    '</div>';
		    $('.sk-fading-circle').hide();
		    $('#pcomp-statTypePicker').hide();
		    $('#pcomp-statTypePickerTime').hide();
		    $('#pcomp-container').show();
		    $('#pcomp-container').html(pickers);
		    allOptionsOne = $('.pcomp-playerOne option');
		    allOptionsTwo = $('.pcomp-playerTwo option');
		};
	//End Create the Player Picker

	//Update the Pickers
		var extrasPlayerCompare = function() {
		  	$(document).on('change', '.pcomp-playerOneYear', function() {
		    	yearPickerOne = $('.pcomp-playerOneYear').val();
		    	updateSelectorsOne();
		  	});
		  	$(document).on('change', '.pcomp-playerTwoYear', function() {
		    	yearPickerTwo = $('.pcomp-playerTwoYear').val();
		    	updateSelectorsTwo();
		  	});
		  	//Pick the Team and Player
			  	$(document).on('change', '.pcomp-playerOneTeam', function() {
				    $('.pcomp-playerOne option').remove();
				    var classN = $('.pcomp-playerOneTeam option:selected').prop('class');
				    var opts = allOptionsOne.filter('.' + classN);
				    $.each(opts, function (i, j) {
				      	$(j).appendTo('.pcomp-playerOne');
				    });
			  	});
			  	$(document).on('change', '.pcomp-playerTwoTeam', function() {
				    $('.pcomp-playerTwo option').remove();
				    var classN = $('.pcomp-playerTwoTeam option:selected').prop('class');
				    var opts = allOptionsTwo.filter('.' + classN);
				    $.each(opts, function (i, j) {
				      	$(j).appendTo('.pcomp-playerTwo');
				    });
			  	});
			  	$(document).on('change', '.pcomp-playerOne', function() {
				    playerIdOne = $('.pcomp-playerOne option:selected').val();
				    isPlayerOne = 1;
				    updatePcompPickerOne();
				    getCompareData();
			  	});
			  	$(document).on('change', '.pcomp-playerTwo', function() {
			    	playerIdTwo = $('.pcomp-playerTwo option:selected').val();
			    	isPlayerTwo = 1;
			    	updatePcompPickerTwo();
			    	getCompareData();
			  	});
			//End Pick the Team and Player
			$(window).resize(function() {
				getCompareData();
			});
			$(document).on('change', '#pcomp-statTypePicker', function() {
				statType = $('#pcomp-statTypePicker').val();
			    statTypeTwo = parseInt(statType) + 7;
			    getCompareData();
			});
			$(document).on('change', '#pcomp-statTypePickerTime', function() {
			    timeType = $('#pcomp-statTypePickerTime').val();
			    getCompareData();
			});
		};
	  	var updateSelectorsOne = function() {
		    $.ajax({
		    	url:"http://mlustats.herokuapp.com/api/v1/players?sid=" + yearPickerOne + "&tid=0",
		    	type:"get",
		    	success: function(data) {
		        	$('.pcomp-playerOneTeam').val(0);
		        	var option = '<option class="selectors BOS NY PHL DC POR SF SEA VAN" value="0"> --Select a Player-- </option>';
		        	for (var i = 0; i < data[0].length; i++) { option +=
		        		'<option value="' + data[0][i].PlayerID + '" class="selectors ' + data[0][i].ShortTeam + '">' + data[0][i].Name + '</option>';
		        	};
		        	$('.pcomp-playerOne').empty().append(option);
		        	allOptionsOne = $('.pcomp-playerOne option');
		      	}
		    });
	  	};
	  	var updateSelectorsTwo = function() {
		    $.ajax({
			    url:"http://mlustats.herokuapp.com/api/v1/players?sid=" + yearPickerTwo + "&tid=0",
			    type:"get",
			    success: function(data) {
			        $('.pcomp-playerTwoTeam').val(0);
			        var option = '<option class="selectors BOS NY PHL DC POR SF SEA VAN" value="0"> --Select a Player-- </option>';
			        for (var i = 0; i < data[0].length; i++) { option +=
			        	'<option value="' + data[0][i].PlayerID + '" class="selectors ' + data[0][i].ShortTeam + '">' + data[0][i].Name + '</option>';
			        };
			        $('.pcomp-playerTwo').empty().append(option);
			        allOptionsTwo = $('.pcomp-playerTwo option');
		      	}
		    });
	  	};
	//End Update the Pickers

	// Update Top with player info
	  	var updatePcompPickerOne = function() {
		    $.ajax({
		      	url:"http://mlustats.herokuapp.com/api/v1/playerCard?pid=" + playerIdOne,
		      	type:"get",
		      	success:function(deta1) {
			        $('.pcomp-pickerContainerPlayer.fleft.bg' + currentPlayerOneTeam).removeClass("bg" + currentPlayerOneTeam);
			        var seasonFinder = (deta1[3].length) - 1;
			        var teamShort = deta1[3][seasonFinder].ss_team_short_name;
			        pOneDaRay = deta1;
			        var infoOne = 
			          	'<div class="pcomp-playerInfoDetails tcenter fleft">' +
				            '<span class="pcomp-playerName"><a href="http://mlultimate.com/player/?pid=' + deta1[0][0].PlayerID + '">' + deta1[0][0].FirstName + ' ' + deta1[0][0].LastName + '</a></span></br>' +
				            '<span class="pcomp-playerDetailText">' + deta1[0][0].TeamCity + ' ' + deta1[0][0].Team + ' - #' + deta1[0][0].Number + '</span></br>' +
				            '<span class="pcomp-playerDetailText">Height: ' + deta1[0][0].Height + ' Weight: ' + deta1[0][0].Weight + '</span></br>' +
				            '<span class="pcomp-playerDetailText">Position: ' + deta1[0][0].Position + ' MLU Experience: ' + deta1[0][0].Experience + '</span>' +
			          	'</div>' +
			          	'<img class="pcomp-playerImg fright" src="http:';
			          	if (deta1[0][0].pic_path == null) { infoOne += '//fantasy.mlultimate.com/img/players/default_player.png">'; }
			          	else { infoOne += deta1[0][0].pic_path + '">'; };
			        $('.pcomp-playerInfo.playerOne').html(infoOne);
			        $('.pcomp-pickerContainerPlayer.fleft').addClass("bg" + teamShort);
			        currentPlayerOneTeam = teamShort;
		      	}
		    });
	  	};
	  	var updatePcompPickerTwo = function() {
	    	$.ajax({
	      		url:"http://mlustats.herokuapp.com/api/v1/playerCard?pid=" + playerIdTwo,
	      		type:"get",
	      		success:function(deta2) {
			        $('.pcomp-pickerContainerPlayer.fright.bg' + currentPlayerTwoTeam).removeClass("bg" + currentPlayerTwoTeam);
			        var seasonFinder = (deta2[3].length) - 1;
			        var teamShort = deta2[3][seasonFinder].ss_team_short_name;
			        pTwoDaRay = deta2;
			        var infoTwo =  
			          	'<div class="pcomp-playerInfoDetails tcenter fright">' +
				            '<span class="pcomp-playerName"><a href="http://mlultimate.com/player/?pid=' + deta2[0][0].PlayerID + '">' + deta2[0][0].FirstName + ' ' + deta2[0][0].LastName + '</a></span></br>' +
				            '<span class="pcomp-playerDetailText">' + deta2[0][0].TeamCity + ' ' + deta2[0][0].Team + ' - #' + deta2[0][0].Number + '</span></br>' +
				            '<span class="pcomp-playerDetailText">Height: ' + deta2[0][0].Height + ' Weight: ' + deta2[0][0].Weight + '</span></br>' +
				            '<span class="pcomp-playerDetailText">Position: ' + deta2[0][0].Position + ' MLU Experience: ' + deta2[0][0].Experience + '</span>' +
			          	'</div>' +
			          	'<img class="pcomp-playerImg fleft" src="http:';
			          	if (deta2[0][0].pic_path == null) { infoTwo += '//fantasy.mlultimate.com/img/players/default_player.png">'; }
			          	else { infoTwo += deta2[0][0].pic_path + '">'; };
			        $('.pcomp-playerInfo.playerTwo').html(infoTwo);
			        $('.pcomp-pickerContainerPlayer.fright').addClass("bg" + teamShort);
			        currentPlayerTwoTeam = teamShort;
	      		}
	    	});
	  	};
	//End Update Top with player info

	//Update Bottom with Compare Information
		$(document).on('change', '#pcomp-statTypePicker', function() {
	    	statType = $('#pcomp-statTypePicker').val();
	    	statTypeTwo = parseInt(statType) + 7;
	    	getCompareData();
	  	});
	  	$(document).on('change', '#pcomp-statTypePickerTime', function() {
	    	timeType = $('#pcomp-statTypePickerTime').val();
	    	getCompareData();
	  	});
	  	var getCompareData = function() { //AJAX call for both players information
		    if (isPlayerOne * isPlayerTwo == 0) {} else {
		      	$.ajax({
		        	url:"https://mlustats.herokuapp.com/api/v1/playerCompare/?pidO=" + playerIdOne + "&pidT=" + playerIdTwo,
		        	type:"get",
		        	success:function(data) {
		          		$('#pcomp-statTypePicker').show();
				        $('#pcomp-statTypePickerTime').show();
				        createCompareData(data);
				        $('.pcomp-dataHeader').show();
		        	}
		      	});
		    };
	  	};

	  	var createCompareData = function (data) {
		    drawChartStatsOne(data);
		    drawChartStatsTwo(data);
		    drawChartCompOne(data);
		    drawChartCompTwo(data);
		    drawChartOppDppOne(data);
		    drawChartOppDppTwo(data);
		    drawChartOseOne(data);
		    drawChartDseOne(data);
		    drawChartOseTwo(data);
		    drawChartDseTwo(data);
		    drawTableData(data);
	  	};
	//End Update Bottom with Compare Information

	//Google DataViz Charts
		google.charts.load('current', {packages: ['corechart']});
		google.charts.load('current', {packages: ['corechart']});
		google.charts.setOnLoadCallback(drawChartStatsOne);
		google.charts.setOnLoadCallback(drawChartStatsTwo);
		google.charts.setOnLoadCallback(drawChartCompOne);
		google.charts.setOnLoadCallback(drawChartCompTwo);
		google.charts.setOnLoadCallback(drawChartOppDppOne);
		google.charts.setOnLoadCallback(drawChartOppDppTwo);
		google.charts.setOnLoadCallback(drawChartOseOne);
		google.charts.setOnLoadCallback(drawChartDseOne);
		google.charts.setOnLoadCallback(drawChartOseTwo);
		google.charts.setOnLoadCallback(drawChartDseTwo);
		//Base Stats
		    var drawChartStatsOne = function(data) {
		      	$('#pcomp-dataBaseStatsOne').addClass('getSize');
		      	if (statType == 1) { //Totals
		        	if (timeType == 1) { //Season
		          		var seasonFinder = -1;
		          		for (var i = 0; i < data[1].length; i++) {
		            		seasonFinder += 1;
		            		if (data[1][i].ss_season_id_fk == yearPickerOne) {
		              			break;
		            		};
		          		};
		          		var seasonFinderAlt = -1;
		          		for (var i = 0; i < data[8].length; i++) {
		            		seasonFinderAlt += 1;
				            if (data[8][i].ss_season_id_fk == yearPickerTwo) {
				              	break;
				            };
		          		};
		          		var maxRange = 1 + Math.max(data[1][seasonFinder].ss_goals, data[1][seasonFinder].ss_assists, data[1][seasonFinder].ss_blocks, data[8][seasonFinderAlt].ss_goals, data[8][seasonFinderAlt].ss_assists, data[8][seasonFinderAlt].ss_blocks);
		          		var statsGraphOne = google.visualization.arrayToDataTable([
		            		['Stat', '#', {role: 'style'}, { role: 'annotation'}],
				            ['Goals', data[1][seasonFinder].ss_goals, data[0][0].TeamColor1, 'Goals'],
				            ['Assists', data[1][seasonFinder].ss_assists, data[0][0].TeamColor1, 'Assists'],
				            ['Blocks', data[1][seasonFinder].ss_blocks, data[0][0].TeamColor1, 'Blocks']
		          		]);
		        	} else if (timeType == -1) { //Career
				        var seasonFinder = 0;
				        var seasonFinderAlt = 0;
				        var maxRange = 1 + Math.max(data[3][seasonFinder].ct_goals, data[3][seasonFinder].ct_assists, data[3][seasonFinder].ct_blocks, data[10][seasonFinderAlt].ct_goals, data[10][seasonFinderAlt].ct_assists, data[10][seasonFinderAlt].ct_blocks);
				        var statsGraphOne = google.visualization.arrayToDataTable([
				        	['Stat', '#', {role: 'style'}, { role: 'annotation'}],
				            ['Goals', data[3][seasonFinder].ct_goals, data[0][0].TeamColor1, 'Goals'],
				            ['Assists', data[3][seasonFinder].ct_assists, data[0][0].TeamColor1, 'Assists'],
				            ['Blocks', data[3][seasonFinder].ct_blocks, data[0][0].TeamColor1, 'Blocks']
				        ]);
			        };
		      	} else if (statType == 2) { //Averages
		        	if (timeType == 1) { //Season
		          		var seasonFinder = -1;
		          		for (var i = 0; i < data[2].length; i++) {
		            		seasonFinder += 1;
		            		if (data[2][i].sa_season_id_fk == yearPickerOne) {
		              			break;
		            		};
		          		};
		          		var seasonFinderAlt = -1;
		          		for (var i = 0; i < data[9].length; i++) {
		            		seasonFinderAlt += 1;
		            		if (data[9][i].sa_season_id_fk == yearPickerTwo) {
		             	 		break;
		            		};
		          		};
		          		var maxRange = 1 + Math.max(data[2][seasonFinder].sa_goals, data[2][seasonFinder].sa_assists, data[2][seasonFinder].sa_blocks, data[9][seasonFinderAlt].sa_goals, data[9][seasonFinderAlt].sa_assists, data[9][seasonFinderAlt].sa_blocks);
		          		var statsGraphOne = google.visualization.arrayToDataTable([
				            ['Stat', '#', {role: 'style'}, { role: 'annotation'}],
				            ['Goals', data[2][seasonFinder].sa_goals, data[0][0].TeamColor1, 'Goals'],
				            ['Assists', data[2][seasonFinder].sa_assists, data[0][0].TeamColor1, 'Assists'],
				            ['Blocks', data[2][seasonFinder].sa_blocks, data[0][0].TeamColor1, 'Blocks']
		          		]);
		        	} else if (timeType == -1) {
			          	var seasonFinder = 0;
			          	var seasonFinderAlt = 0;
			          	var maxRange = 1 + Math.max(data[4][seasonFinder].ca_goals, data[4][seasonFinder].ca_assists, data[4][seasonFinder].ca_blocks, data[11][seasonFinderAlt].ca_goals, data[11][seasonFinderAlt].ca_assists, data[11][seasonFinderAlt].ca_blocks);
			          	var statsGraphOne = google.visualization.arrayToDataTable([
				            ['Stat', '#', {role: 'style'}, { role: 'annotation'}],
				            ['Goals', data[4][seasonFinder].ca_goals, data[0][0].TeamColor1, 'Goals'],
				            ['Assists', data[4][seasonFinder].ca_assists, data[0][0].TeamColor1, 'Assists'],
				            ['Blocks', data[4][seasonFinder].ca_blocks, data[0][0].TeamColor1, 'Blocks']
		          		]);
		        	};
		      	};
		      	var options = {
			        legend: {position: "none"},
			        hAxis: {ticks: [0, maxRange], direction: -1},
			        vAxis: {textPosition: "none"},
			        chartArea: {width: '100%', height: '100%'},
			        bars: 'horizontal' // Required for Material Bar Charts.
		      	};
		      	var chart = new google.visualization.BarChart(document.getElementById('pcomp-dataBaseStatsOne'));
		      	chart.draw(statsGraphOne, options);
		    };
		    var drawChartStatsTwo = function(data) {
		      	$('#pcomp-dataBaseStatsTwo').addClass('getSize');
		      	if (statTypeTwo == 8) {
		        	if (timeType == 1) {
		          		var seasonFinder = -1;
		          		for (var i = 0; i < data[8].length; i++) {
		            		seasonFinder += 1;
		            		if (data[8][i].ss_season_id_fk == yearPickerTwo) {
		              			break;
		            		};
		          		};
		          		var seasonFinderAlt = -1;
		          		for (var i = 0; i < data[1].length; i++) {
		            		seasonFinderAlt += 1;
		            			if (data[1][i].ss_season_id_fk == yearPickerOne) {
		              				break;
		            			};
		          		};
		          		var maxRange = 1 + Math.max(data[1][seasonFinderAlt].ss_goals, data[1][seasonFinderAlt].ss_assists, data[1][seasonFinderAlt].ss_blocks, data[8][seasonFinder].ss_goals, data[8][seasonFinder].ss_assists, data[8][seasonFinder].ss_blocks);
		          		var statsGraphTwo = google.visualization.arrayToDataTable([
				            ['Stat', '#', {role: 'style'}, { role: 'annotation'}],
				            ['Goals', data[8][seasonFinder].ss_goals, data[7][0].TeamColor, 'Goals'],
				            ['Assists', data[8][seasonFinder].ss_assists, data[7][0].TeamColor, 'Assists'],
				            ['Blocks', data[8][seasonFinder].ss_blocks, data[7][0].TeamColor, 'Blocks']
		          		]);
		        	} else if (timeType == -1) {
			          	var seasonFinder = 0;
			          	var seasonFinderAlt = 0;
			          	var maxRange = 1 + Math.max(data[3][seasonFinderAlt].ct_goals, data[3][seasonFinderAlt].ct_assists, data[3][seasonFinderAlt].ct_blocks, data[10][seasonFinder].ct_goals, data[10][seasonFinder].ct_assists, data[10][seasonFinder].ct_blocks);
		          		var statsGraphTwo = google.visualization.arrayToDataTable([
				            ['Stat', '#', {role: 'style'}, { role: 'annotation'}],
				            ['Goals', data[10][seasonFinder].ct_goals, data[7][0].TeamColor, 'Goals'],
				            ['Assists', data[10][seasonFinder].ct_assists, data[7][0].TeamColor, 'Assists'],
				            ['Blocks', data[10][seasonFinder].ct_blocks, data[7][0].TeamColor, 'Blocks']
		          		]);
		        	};
		      	} else if (statTypeTwo == 9) {
		        	if (timeType == 1) {
		          		var seasonFinder = -1;
		          		for (var i = 0; i < data[9].length; i++) {
		            		seasonFinder += 1;
		            		if (data[9][i].sa_season_id_fk == yearPickerTwo) {
		              			break;
		            		};
		          		};
		          		var seasonFinderAlt = -1;
		          		for (var i = 0; i < data[2].length; i++) {
		            		seasonFinderAlt += 1;
		            		if (data[2][i].ss_season_id_fk == yearPickerTwo) {
		              			break;
		            		};
		          		};
		          		var maxRange = 1 + Math.max(data[2][seasonFinderAlt].sa_goals, data[2][seasonFinderAlt].sa_assists, data[2][seasonFinderAlt].sa_blocks, data[9][seasonFinder].sa_goals, data[9][seasonFinder].sa_assists, data[9][seasonFinder].sa_blocks);
		          		var statsGraphTwo = google.visualization.arrayToDataTable([
				            ['Stat', '#', {role: 'style'}, { role: 'annotation'}],
				            ['Goals', data[9][seasonFinder].sa_goals, data[7][0].TeamColor, 'Goals'],
				            ['Assists', data[9][seasonFinder].sa_assists, data[7][0].TeamColor, 'Assists'],
				            ['Blocks', data[9][seasonFinder].sa_blocks, data[7][0].TeamColor, 'Blocks']
		          		]);
		        	} else if (timeType == -1) {
		          		var seasonFinder = 0;
		          		var seasonFinderAlt = 0;
		          		var maxRange = 1 + Math.max(data[4][seasonFinderAlt].ca_goals, data[4][seasonFinderAlt].ca_assists, data[4][seasonFinderAlt].ca_blocks, data[11][seasonFinder].ca_goals, data[11][seasonFinder].ca_assists, data[11][seasonFinder].ca_blocks);
		          		var statsGraphTwo = google.visualization.arrayToDataTable([
				            ['Stat', '#', {role: 'style'}, { role: 'annotation'}],
				            ['Goals', data[11][seasonFinder].ca_goals, data[7][0].TeamColor, 'Goals'],
				            ['Assists', data[11][seasonFinder].ca_assists, data[7][0].TeamColor, 'Assists'],
				            ['Blocks', data[11][seasonFinder].ca_blocks, data[7][0].TeamColor, 'Blocks']
		          		]);
		        	};
		      	};
		      	var options = {
			        legend: {position: "none"},
			        hAxis: {ticks: [0, maxRange], direction: 1},
			        vAxis: {textPosition: "none"},
			        chartArea: {width: '100%', height: '100%'},
			        bars: 'horizontal' // Required for Material Bar Charts.
		      	};
		      	var chart = new google.visualization.BarChart(document.getElementById('pcomp-dataBaseStatsTwo'));
		      	chart.draw(statsGraphTwo, options);
		    };
		//End Base Stats

		//Completion Percentages
		    var drawChartCompOne = function(data) {
		      if (timeType == 1) {
		        var seasonFinder = -1;
		        for (var i = 0; i < data[1].length; i++) {
		          seasonFinder += 1;
		          if (data[1][i].ss_season_id_fk == yearPickerOne) {
		            break;
		          };
		        };
		        var teamColor = data[0][0].TeamColor1;
		        var data = google.visualization.arrayToDataTable([
		          ['Result', 'Throws'],
		          ['Complete', data[1][seasonFinder].ss_completions],
		          ['Incomplete', (data[1][seasonFinder].ss_throws - data[1][seasonFinder].ss_completions)]
		        ]);
		      } else if (timeType == -1) {
		        var seasonFinder = 0;
		        var teamColor = data[0][0].TeamColor1;
		        var data = google.visualization.arrayToDataTable([
		          ['Result', 'Throws'],
		          ['Complete', data[3][seasonFinder].ct_completions],
		          ['Incomplete', (data[3][seasonFinder].ct_throws - data[3][seasonFinder].ct_completions)]
		        ]);
		      };

		      var options = {
		        legend: {position: "none"},
		        width: "100%",
		        height: "100%",
		        chartArea: {width: '100%', height: '100%'},
		        slices: {
		          0: {color: teamColor},
		          1: {color: '#000000'}
		        },
		        reverseCategories: 'false'
		      };

		      var chart = new google.visualization.PieChart(document.getElementById('pcomp-dataCompPercOne'));

		      chart.draw(data, options);
		    }
		    var drawChartCompTwo = function(data) {
		      if (timeType == 1) {
		        var seasonFinder = -1;
		        for (var i = 0; i < data[8].length; i++) {
		          seasonFinder += 1;
		          if (data[8][i].ss_season_id_fk == yearPickerTwo) {
		            break;
		          };
		        };
		        var teamColor = data[7][0].TeamColor;
		        var data = google.visualization.arrayToDataTable([
		          ['Result', 'Throws'],
		          ['Complete', data[8][seasonFinder].ss_completions],
		          ['Incomplete', (data[8][seasonFinder].ss_throws - data[8][seasonFinder].ss_completions)]
		        ]);
		      } else if (timeType == -1) {
		        var seasonFinder = 0;
		        var teamColor = data[7][0].TeamColor;
		        var data = google.visualization.arrayToDataTable([
		          ['Result', 'Throws'],
		          ['Complete', data[10][seasonFinder].ct_completions],
		          ['Incomplete', (data[10][seasonFinder].ct_throws - data[10][seasonFinder].ct_completions)]
		        ]);
		      };

		      var options = {
		        legend: {position: "none"},
		        width: "100%",
		        height: "100%",
		        chartArea: {width: '100%', height: '100%'},
		        slices: {
		          0: {color: '#000000'},
		          1: {color: teamColor}
		        },
		        reverseCategories: 'true'
		      };

		      var chart = new google.visualization.PieChart(document.getElementById('pcomp-dataCompPercTwo'));

		      chart.draw(data, options);
		    }
		//End Completion Percentages

		//Points Played
		    var drawChartOppDppOne = function(data) {
		      var teamColor = data[0][0].TeamColor1;
		      if (statType == 1) {
		        if (timeType == 1) {
		          var seasonFinder = -1;
		          for (var i = 0; i < data[1].length; i++) {
		            seasonFinder += 1;
		            if (data[1][i].ss_season_id_fk == yearPickerOne) {
		              break;
		            };
		          };
		          var data = google.visualization.arrayToDataTable([
		            ['Points Played', '#'],
		            ['Offense', data[1][seasonFinder].ss_o_points_played],
		            ['Defense', data[1][seasonFinder].ss_d_points_played]
		          ]);
		        } else if (timeType == -1) {
		          var seasonFinder = 0;
		          var data = google.visualization.arrayToDataTable([
		            ['Points Played', '#'],
		            ['Offense', data[3][seasonFinder].ct_o_points_played],
		            ['Defense', data[3][seasonFinder].ct_d_points_played]
		          ]);
		        };
		      } else if (statType == 2) {
		        if (timeType == 1) {
		          var seasonFinder = -1;
		          for (var i = 0; i < data[2].length; i++) {
		            seasonFinder += 1;
		            if (data[2][i].sa_season_id_fk == yearPickerOne) {
		              break;
		            };
		          };
		          var data = google.visualization.arrayToDataTable([
		            ['Points Played', '#'],
		            ['Offense', data[2][seasonFinder].sa_o_points_played],
		            ['Defense', data[2][seasonFinder].sa_d_points_played]
		          ]);
		        } else if (timeType == -1) {
		          var seasonFinder = 0;
		          var data = google.visualization.arrayToDataTable([
		            ['Points Played', '#'],
		            ['Offense', data[4][seasonFinder].ca_o_points_played],
		            ['Defense', data[4][seasonFinder].ca_d_points_played]
		          ]);
		        };
		      };

		      var options = {
		        legend: {position: "none"},
		        width: "100%",
		        height: "100%",
		        chartArea: {width: '100%', height: '100%'},
		        slices: {
		          0: {color: teamColor},
		          1: {color: '#000000'}
		        },
		        reverseCategories: 'false'
		      };

		      var chart = new google.visualization.PieChart(document.getElementById('pcomp-dataPoPlOne'));

		      chart.draw(data, options);
		    }
		    var drawChartOppDppTwo = function(data) {
		      var teamColor = data[7][0].TeamColor;
		      if (statTypeTwo == 8) {
		        if (timeType == 1) {
		          var seasonFinder = -1;
		          for (var i = 0; i < data[8].length; i++) {
		            seasonFinder += 1;
		            if (data[8][i].ss_season_id_fk == yearPickerTwo) {
		              break;
		            };
		          };
		          var data = google.visualization.arrayToDataTable([
		            ['Points Played', '#'],
		            ['Offense', data[8][seasonFinder].ss_o_points_played],
		            ['Defense', data[8][seasonFinder].ss_d_points_played]
		          ]);
		        } else if (timeType == -1) {
		          var seasonFinder = 0;
		          var data = google.visualization.arrayToDataTable([
		            ['Points Played', '#'],
		            ['Offense', data[10][seasonFinder].ct_o_points_played],
		            ['Defense', data[10][seasonFinder].ct_d_points_played]
		          ]);
		        };
		      } else if (statTypeTwo == 9) {
		        if (timeType == 1) {
		          var seasonFinder = -1;
		          for (var i = 0; i < data[9].length; i++) {
		            seasonFinder += 1;
		            if (data[9][i].sa_season_id_fk == yearPickerTwo) {
		              break;
		            };
		          };
		          var data = google.visualization.arrayToDataTable([
		            ['Points Played', '#'],
		            ['Offense', data[9][seasonFinder].sa_o_points_played],
		            ['Defense', data[9][seasonFinder].sa_d_points_played]
		          ]);
		        } else if (timeType == -1) {
		          var seasonFinder = 0;
		          var data = google.visualization.arrayToDataTable([
		            ['Points Played', '#'],
		            ['Offense', data[11][seasonFinder].ca_o_points_played],
		            ['Defense', data[11][seasonFinder].ca_d_points_played]
		          ]);
		        };
		      };

		      var options = {
		        legend: {position: "none"},
		        width: "100%",
		        height: "100%",
		        chartArea: {width: '100%', height: '100%'},
		        slices: {
		          0: {color: '#000000'},
		          1: {color: teamColor}
		        },
		        reverseCategories: 'true'
		      };

		      var chart = new google.visualization.PieChart(document.getElementById('pcomp-dataPoPlTwo'));

		      chart.draw(data, options);
		    }
		//End Points Played

		//OSE DSE
		    var drawChartOseOne = function(data) {
		      var teamColor = data[0][0].TeamColor1;
		      if (timeType == 1) {
		        var seasonFinder = -1;
		        for (var i = 0; i < data[1].length; i++) {
		          seasonFinder += 1;
		          if (data[1][i].ss_season_id_fk == yearPickerOne) {
		            break;
		          };
		        };
		        var opp = (100 - parseFloat(data[1][seasonFinder].ss_ose));
		        var data = google.visualization.arrayToDataTable([
		          ['Result', '%'],
		          ['Held', parseFloat(data[1][seasonFinder].ss_ose)],
		          ['Didn\'t Score', opp]
		        ]);
		      } else if (timeType == -1) {
		        var seasonFinder = 0;
		        var opp = (100 - parseFloat(data[3][seasonFinder].ct_ose));
		        var data = google.visualization.arrayToDataTable([
		          ['Result', '%'],
		          ['Held', parseFloat(data[3][seasonFinder].ct_ose)],
		          ['Didn\'t Score', opp]
		        ]);
		      };

		      var options = {
		        legend: {position: "none"},
		        width: "100%",
		        height: "100%",
		        chartArea: {width: '100%', height: '100%'},
		        slices: {
		          0: {color: teamColor},
		          1: {color: '#000000'}
		        },
		        reverseCategories: 'false'
		      };

		      var chart = new google.visualization.PieChart(document.getElementById('pcomp-dataOseOne'));

		      chart.draw(data, options);
		    }
		    var drawChartDseOne = function(data) {
		      var teamColor = data[0][0].TeamColor1;
		      if (timeType == 1) {
		        var seasonFinder = -1;
		        for (var i = 0; i < data[1].length; i++) {
		          seasonFinder += 1;
		          if (data[1][i].ss_season_id_fk == yearPickerOne) {
		            break;
		          };
		        };
		        var opp = (100 - parseFloat(data[1][seasonFinder].ss_dse));
		        var data = google.visualization.arrayToDataTable([
		          ['Result', '%'],
		          ['Broke', parseFloat(data[1][seasonFinder].ss_dse)],
		          ['Didn\'t Break', opp]
		        ]);
		      } else if (timeType == -1) {
		        var seasonFinder = 0;
		        var opp = (100 - parseFloat(data[3][seasonFinder].ct_dse));
		        var data = google.visualization.arrayToDataTable([
		          ['Result', '%'],
		          ['Broke', parseFloat(data[3][seasonFinder].ct_dse)],
		          ['Didn\'t Break', opp]
		        ]);
		      };

		      var options = {
		        legend: {position: "none"},
		        width: "100%",
		        height: "100%",
		        chartArea: {width: '100%', height: '100%'},
		        slices: {
		          0: {color: teamColor},
		          1: {color: '#000000'}
		        },
		        reverseCategories: 'false'
		      };

		      var chart = new google.visualization.PieChart(document.getElementById('pcomp-dataDseOne'));

		      chart.draw(data, options);
		    }
		    var drawChartOseTwo = function(data) {
		      var teamColor = data[7][0].TeamColor;
		      if (timeType == 1) {
		        var seasonFinder = -1;
		        for (var i = 0; i < data[8].length; i++) {
		          seasonFinder += 1;
		          if (data[8][i].ss_season_id_fk == yearPickerTwo) {
		            break;
		          };
		        };
		        var opp = (100 - parseFloat(data[8][seasonFinder].ss_ose));
		        var data = google.visualization.arrayToDataTable([
		          ['Result', '%'],
		          ['Held', parseFloat(data[8][seasonFinder].ss_ose)],
		          ['Didn\'t Score', opp]
		        ]);
		      } else if (timeType == -1) {
		        var seasonFinder = 0;
		        var opp = (100 - parseFloat(data[10][seasonFinder].ct_ose));
		        var data = google.visualization.arrayToDataTable([
		          ['Result', '%'],
		          ['Held', parseFloat(data[10][seasonFinder].ct_ose)],
		          ['Didn\'t Score', opp]
		        ]);
		      };

		      var options = {
		        legend: {position: "none"},
		        width: "100%",
		        height: "100%",
		        chartArea: {width: '100%', height: '100%'},
		        slices: {
		          0: {color: '#000000'},
		          1: {color: teamColor}
		        },
		        reverseCategories: 'true'
		      };

		      var chart = new google.visualization.PieChart(document.getElementById('pcomp-dataOseTwo'));

		      chart.draw(data, options);
		    }
		    var drawChartDseTwo = function(data) {
		      var teamColor = data[7][0].TeamColor;
		      if (timeType == 1) {
		        var seasonFinder = -1;
		        for (var i = 0; i < data[8].length; i++) {
		          seasonFinder += 1;
		          if (data[8][i].ss_season_id_fk == yearPickerTwo) {
		            break;
		          };
		        };
		        var opp = (100 - parseFloat(data[8][seasonFinder].ss_dse));
		        var data = google.visualization.arrayToDataTable([
		          ['Result', '%'],
		          ['Broke', parseFloat(data[8][seasonFinder].ss_dse)],
		          ['Didn\'t Break', opp]
		        ]);
		      } else if (timeType == -1) {
		        var seasonFinder = 0;
		        var opp = (100 - parseFloat(data[10][seasonFinder].ct_dse));
		        var data = google.visualization.arrayToDataTable([
		          ['Result', '%'],
		          ['Broke', parseFloat(data[10][seasonFinder].ct_dse)],
		          ['Didn\'t Break', opp]
		        ]);
		      };

		      var options = {
		        legend: {position: "none"},
		        width: "100%",
		        height: "100%",
		        chartArea: {width: '100%', height: '100%'},
		        slices: {
		          0: {color: '#000000'},
		          1: {color: teamColor}
		        },
		        reverseCategories: 'true'
		      };

		      var chart = new google.visualization.PieChart(document.getElementById('pcomp-dataDseTwo'));

		      chart.draw(data, options);
		    }
		//End OSE DSE
	//End Google DataViz Charts

	//Tabled Data at the Bottom
		var drawTableData = function(data) {
		    if (statType == 1) {
		      	if (timeType == 1) {
		        	var seasonFinderOne = -1;
		          	for (var i = 0; i < data[1].length; i++) {
		            	seasonFinderOne += 1;
		            	if (data[1][i].ss_season_id_fk == yearPickerOne) {
		              		break;
		            	};
		          	};
		        	var seasonFinderTwo = -1;
		          		for (var i = 0; i < data[8].length; i++) {
		            	seasonFinderTwo += 1;
		            	if (data[8][i].ss_season_id_fk == yearPickerTwo) {
		            		break;
		            	};
		          	};
		      	} else if (timeType == -1) {
			        var seasonFinderOne = (data[3].length) - 1;
			        var seasonFinderTwo = (data[10].length) - 1;
		      	};
		    } else if (statType == 2) {
		      	if (timeType == 1) {
		        	var seasonFinderOne = -1;
		          	for (var i = 0; i < data[2].length; i++) {
		            	seasonFinderOne += 1;
		            	if (data[2][i].sa_season_id_fk == yearPickerOne) {
		              		break;
		            	};
		          	};
		        	var seasonFinderTwo = -1;
		          	for (var i = 0; i < data[9].length; i++) {
		            	seasonFinderTwo += 1;
		            	if (data[9][i].sa_season_id_fk == yearPickerTwo) {
		              		break;
		            	};
		          	};
		      	} else if (timeType == -1) {
			        var seasonFinderOne = (data[4].length) - 1;
			        var seasonFinderTwo = (data[11].length) - 1;
			    };
		    };
	    	var pcompTables =
	      		'<table class="pcomp-compareTableBase">';
	        		if (statType == 1) {
	          			if (timeType == 1) { pcompTables +=
	              			'<thead>' +
				                '<tr>' +
					                '<th>Player</th>' +
					                '<th>Team</th>' +
					                '<th>Year</th>' +
					                '<th>G+A</th>' +
					                '<th>G</th>' +
					                '<th>A</th>' +
					                '<th>B</th>' +
					                '<th>BND</th>' +
					                '<th>CMP</th>' +
					                '<th>THR</th>' +
					                '<th>CMP%</th>' +
					                '<th>CAT</th>' +
					                '<th>C</th>' +
					                '<th>D</th>' +
					                '<th>F</th>' +
					                '<th>TPOP</th>' +
					                '<th>PP</th>' +
					                '<th>OP</th>' +
					                '<th>DP</th>' +
					                '<th>OSE</th>' +
					                '<th>DSE</th>' +
					                '<th>DTE</th>' +
				                '</tr>' +
	              			'</thead>' +
	              			'<tbody>' +
				                '<tr>' +
				                	'<td>' + data[1][seasonFinderOne].ss_player + '</td>' +
				                	'<td>' + data[1][seasonFinderOne].ss_team_short_name + '</td>' +
				                	'<td>' + data[1][seasonFinderOne].se_year + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_points > data[8][seasonFinderTwo].ss_points) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_points + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_goals > data[8][seasonFinderTwo].ss_goals) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_goals + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_assists > data[8][seasonFinderTwo].ss_assists) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_assists + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_blocks > data[8][seasonFinderTwo].ss_blocks) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_blocks + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_bands > data[8][seasonFinderTwo].ss_bands) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_bands + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_completions > data[8][seasonFinderTwo].ss_completions) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_completions + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_throws > data[8][seasonFinderTwo].ss_throws) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_throws + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_completion_percentage > data[8][seasonFinderTwo].ss_completion_percentage) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_completion_percentage + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_catches > data[8][seasonFinderTwo].ss_catches) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_catches + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_callahans > data[8][seasonFinderTwo].ss_callahans) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_callahans + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_drops > data[8][seasonFinderTwo].ss_drops) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_drops + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_fouls > data[8][seasonFinderTwo].ss_fouls) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_fouls + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_tpop > data[8][seasonFinderTwo].ss_tpop) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_tpop + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_points_played > data[8][seasonFinderTwo].ss_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_points_played + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_o_points_played > data[8][seasonFinderTwo].ss_o_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_o_points_played + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_d_points_played > data[8][seasonFinderTwo].ss_d_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_d_points_played + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_ose > data[8][seasonFinderTwo].ss_ose) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_ose + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_dse > data[8][seasonFinderTwo].ss_dse) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_dse + '</td>' +
				                	'<td '; if (data[1][seasonFinderOne].ss_dte > data[8][seasonFinderTwo].ss_dte) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[1][seasonFinderOne].ss_dte + '</td>' +
				                '</tr>' +
				                '<tr>' +
				                	'<td>' + data[8][seasonFinderTwo].ss_player + '</td>' +
				                	'<td>' + data[8][seasonFinderTwo].ss_team_short_name + '</td>' +
				                	'<td>' + data[8][seasonFinderTwo].se_year + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_points > data[1][seasonFinderOne].ss_points) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_points + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_goals > data[1][seasonFinderOne].ss_goals) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_goals + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_assists > data[1][seasonFinderOne].ss_assists) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_assists + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_blocks > data[1][seasonFinderOne].ss_blocks) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_blocks + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_bands > data[1][seasonFinderOne].ss_bands) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_bands + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_completions > data[1][seasonFinderOne].ss_completions) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_completions + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_throws > data[1][seasonFinderOne].ss_throws) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_throws + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_completion_percentage > data[1][seasonFinderOne].ss_completion_percentage) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_completion_percentage + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_catches > data[1][seasonFinderOne].ss_catches) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_catches + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_callahans > data[1][seasonFinderOne].ss_callahans) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_callahans + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_drops > data[1][seasonFinderOne].ss_drops) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_drops + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_fouls > data[1][seasonFinderOne].ss_fouls) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_fouls + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_tpop > data[1][seasonFinderOne].ss_tpop) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_tpop + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_points_played > data[1][seasonFinderOne].ss_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_points_played + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_o_points_played > data[1][seasonFinderOne].ss_o_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_o_points_played + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_d_points_played > data[1][seasonFinderOne].ss_d_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_d_points_played + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_ose > data[1][seasonFinderOne].ss_ose) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_ose + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_dse > data[1][seasonFinderOne].ss_dse) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_dse + '</td>' +
				                	'<td '; if (data[8][seasonFinderTwo].ss_dte > data[1][seasonFinderOne].ss_dte) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[8][seasonFinderTwo].ss_dte + '</td>' +
				                '</tr>' +
	              			'</tbody>';
	          			} else if (timeType == -1) { pcompTables +=
	              			'<thead>' +
				                '<tr>' +
				                	'<th>Player</th>' +
				                	'<th>G+A</th>' +
				                	'<th>G</th>' +
				                	'<th>A</th>' +
				                	'<th>B</th>' +
				                	'<th>BND</th>' +
				                	'<th>CMP</th>' +
				                	'<th>THR</th>' +
				                	'<th>CMP%</th>' +
				                	'<th>CAT</th>' +
				                	'<th>C</th>' +
				                	'<th>D</th>' +
				                	'<th>F</th>' +
				                	'<th>TPOP</th>' +
				                	'<th>PP</th>' +
				                	'<th>OP</th>' +
				                	'<th>DP</th>' +
				                	'<th>OSE</th>' +
				                	'<th>DSE</th>' +
				                	'<th>DTE</th>' +
				                '</tr>' +
				            '</thead>' +
				            '<tbody>' +
				                '<tr>' +
				                	'<td>' + data[3][seasonFinderOne].ct_player + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_points > data[10][seasonFinderTwo].ct_points) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_points + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_goals > data[10][seasonFinderTwo].ct_goals) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_goals + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_assists > data[10][seasonFinderTwo].ct_assists) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_assists + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_blocks > data[10][seasonFinderTwo].ct_blocks) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_blocks + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_bands > data[10][seasonFinderTwo].ct_bands) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_bands + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_completions > data[10][seasonFinderTwo].ct_completions) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_completions + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_throws > data[10][seasonFinderTwo].ct_throws) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_throws + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_completion_percentage > data[10][seasonFinderTwo].ct_completion_percentage) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_completion_percentage + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_catches > data[10][seasonFinderTwo].ct_catches) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_catches + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_callahans > data[10][seasonFinderTwo].ct_callahans) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_callahans + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_drops > data[10][seasonFinderTwo].ct_drops) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_drops + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_fouls > data[10][seasonFinderTwo].ct_fouls) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_fouls + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_tpop > data[10][seasonFinderTwo].ct_tpop) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_tpop + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_points_played > data[10][seasonFinderTwo].ct_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_points_played + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_o_points_played > data[10][seasonFinderTwo].ct_o_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_o_points_played + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_d_points_played > data[10][seasonFinderTwo].ct_d_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_d_points_played + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_ose > data[10][seasonFinderTwo].ct_ose) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_ose + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_dse > data[10][seasonFinderTwo].ct_dse) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_dse + '</td>' +
				                	'<td '; if (data[3][seasonFinderOne].ct_dte > data[10][seasonFinderTwo].ct_dte) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[3][seasonFinderOne].ct_dte + '</td>' +
				                '</tr>' +
				                '<tr>' +
				                	'<td>' + data[10][seasonFinderTwo].ct_player + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_points > data[3][seasonFinderOne].ct_points) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_points + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_goals > data[3][seasonFinderOne].ct_goals) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_goals + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_assists > data[3][seasonFinderOne].ct_assists) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_assists + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_blocks > data[3][seasonFinderOne].ct_blocks) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_blocks + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_bands > data[3][seasonFinderOne].ct_bands) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_bands + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_completions > data[3][seasonFinderOne].ct_completions) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_completions + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_throws > data[3][seasonFinderOne].ct_throws) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_throws + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_completion_percentage > data[3][seasonFinderOne].ct_completion_percentage) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_completion_percentage + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_catches > data[3][seasonFinderOne].ct_catches) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_catches + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_callahans > data[3][seasonFinderOne].ct_callahans) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_callahans + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_drops > data[3][seasonFinderOne].ct_drops) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_drops + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_fouls > data[3][seasonFinderOne].ct_fouls) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_fouls + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_tpop > data[3][seasonFinderOne].ct_tpop) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_tpop + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_points_played > data[3][seasonFinderOne].ct_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_points_played + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_o_points_played > data[3][seasonFinderOne].ct_o_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_o_points_played + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_d_points_played > data[3][seasonFinderOne].ct_d_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_d_points_played + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_ose > data[3][seasonFinderOne].ct_ose) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_ose + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_dse > data[3][seasonFinderOne].ct_dse) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_dse + '</td>' +
				                	'<td '; if (data[10][seasonFinderTwo].ct_dte > data[3][seasonFinderOne].ct_dte) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[10][seasonFinderTwo].ct_dte + '</td>' +
				                '</tr>' +
	              			'</tbody>';
	          			};
	        		} else if (statType == 2) {
	          			if (timeType == 1) { pcompTables +=
	              			'<thead>' +
				                '<tr>' +
				                	'<th>Player</th>' +
				                	'<th>Team</th>' +
				                	'<th>Year</th>' +
				                	'<th>G+A</th>' +
				                	'<th>G</th>' +
				                	'<th>A</th>' +
				                	'<th>B</th>' +
				                	'<th>BND</th>' +
				                	'<th>CMP</th>' +
				                	'<th>THR</th>' +
				                	'<th>CAT</th>' +
				                	'<th>C</th>' +
				                	'<th>D</th>' +
				                	'<th>F</th>' +
				                	'<th>PP</th>' +
				                	'<th>OP</th>' +
				                	'<th>DP</th>' +
				                '</tr>' +
	              			'</thead>' +
	              			'<tbody>' +
				                '<tr>' +
				                	'<td>' + data[2][seasonFinderOne].sa_player + '</td>' +
				                	'<td>' + data[2][seasonFinderOne].sa_team_short_name + '</td>' +
				                	'<td>' + data[2][seasonFinderOne].se_year + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_points > data[9][seasonFinderTwo].sa_points) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_points + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_goals > data[9][seasonFinderTwo].sa_goals) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_goals + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_assists > data[9][seasonFinderTwo].sa_assists) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_assists + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_blocks > data[9][seasonFinderTwo].sa_blocks) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_blocks + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_bands > data[9][seasonFinderTwo].sa_bands) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_bands + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_completions > data[9][seasonFinderTwo].sa_completions) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_completions + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_throws > data[9][seasonFinderTwo].sa_throws) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_throws + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_catches > data[9][seasonFinderTwo].sa_catches) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_catches + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_callahans > data[9][seasonFinderTwo].sa_callahans) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_callahans + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_drops > data[9][seasonFinderTwo].sa_drops) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_drops + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_fouls > data[9][seasonFinderTwo].sa_fouls) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_fouls + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_points_played > data[9][seasonFinderTwo].sa_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_points_played + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_o_points_played > data[9][seasonFinderTwo].sa_o_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_o_points_played + '</td>' +
				                	'<td '; if (data[2][seasonFinderOne].sa_d_points_played > data[9][seasonFinderTwo].sa_d_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[2][seasonFinderOne].sa_d_points_played + '</td>' +
				                '</tr>' +
				                '<tr>' +
				                	'<td>' + data[9][seasonFinderTwo].sa_player + '</td>' +
				                	'<td>' + data[9][seasonFinderTwo].sa_team_short_name + '</td>' +
				                	'<td>' + data[9][seasonFinderTwo].se_year + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_points > data[2][seasonFinderOne].sa_points) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_points + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_goals > data[2][seasonFinderOne].sa_goals) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_goals + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_assists > data[2][seasonFinderOne].sa_assists) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_assists + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_blocks > data[2][seasonFinderOne].sa_blocks) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_blocks + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_bands > data[2][seasonFinderOne].sa_bands) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_bands + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_completions > data[2][seasonFinderOne].sa_completions) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_completions + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_throws > data[2][seasonFinderOne].sa_throws) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_throws + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_catches > data[2][seasonFinderOne].sa_catches) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_catches + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_callahans > data[2][seasonFinderOne].sa_callahans) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_callahans + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_drops > data[2][seasonFinderOne].sa_drops) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_drops + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_fouls > data[2][seasonFinderOne].sa_fouls) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_fouls + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_points_played > data[2][seasonFinderOne].sa_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_points_played + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_o_points_played > data[2][seasonFinderOne].sa_o_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_o_points_played + '</td>' +
				                	'<td '; if (data[9][seasonFinderTwo].sa_d_points_played > data[2][seasonFinderOne].sa_d_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[9][seasonFinderTwo].sa_d_points_played + '</td>' +
				                '</tr>' +
	              			'</tbody>';
	          			} else if (timeType == -1) { pcompTables +=
				            '<thead>' +
				                '<tr>' +
				                	'<th>Player</th>' +
				                	'<th>G+A</th>' +
				                	'<th>G</th>' +
				                	'<th>A</th>' +
				                	'<th>B</th>' +
				                	'<th>BND</th>' +
				                	'<th>CMP</th>' +
				                	'<th>THR</th>' +
				                	'<th>CAT</th>' +
				                	'<th>C</th>' +
				                	'<th>D</th>' +
				                	'<th>F</th>' +
				                	'<th>PP</th>' +
				                	'<th>OP</th>' +
				                	'<th>DP</th>' +
				                '</tr>' +
				            '</thead>' +
	              			'<tbody>' +
				                '<tr>' +
				                	'<td>' + data[4][seasonFinderOne].ca_player + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_points > data[11][seasonFinderTwo].ca_points) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_points + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_goals > data[11][seasonFinderTwo].ca_goals) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_goals + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_assists > data[11][seasonFinderTwo].ca_assists) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_assists + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_blocks > data[11][seasonFinderTwo].ca_blocks) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_blocks + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_bands > data[11][seasonFinderTwo].ca_bands) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_bands + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_completions > data[11][seasonFinderTwo].ca_completions) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_completions + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_throws > data[11][seasonFinderTwo].ca_throws) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_throws + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_catches > data[11][seasonFinderTwo].ca_catches) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_catches + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_callahans > data[11][seasonFinderTwo].ca_callahans) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_callahans + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_drops > data[11][seasonFinderTwo].ca_drops) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_drops + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_fouls > data[11][seasonFinderTwo].ca_fouls) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_fouls + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_points_played > data[11][seasonFinderTwo].ca_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_points_played + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_o_points_played > data[11][seasonFinderTwo].ca_o_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_o_points_played + '</td>' +
				                	'<td '; if (data[4][seasonFinderOne].ca_d_points_played > data[11][seasonFinderTwo].ca_d_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[4][seasonFinderOne].ca_d_points_played + '</td>' +
				                '</tr>' +
				                '<tr>' +
				                	'<td>' + data[11][seasonFinderTwo].ca_player + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_points > data[4][seasonFinderOne].ca_points) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_points + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_goals > data[4][seasonFinderOne].ca_goals) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_goals + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_assists > data[4][seasonFinderOne].ca_assists) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_assists + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_blocks > data[4][seasonFinderOne].ca_blocks) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_blocks + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_bands > data[4][seasonFinderOne].ca_bands) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_bands + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_completions > data[4][seasonFinderOne].ca_completions) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_completions + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_throws > data[4][seasonFinderOne].ca_throws) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_throws + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_catches > data[4][seasonFinderOne].ca_catches) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_catches + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_callahans > data[4][seasonFinderOne].ca_callahans) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_callahans + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_drops > data[4][seasonFinderOne].ca_drops) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_drops + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_fouls > data[4][seasonFinderOne].ca_fouls) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_fouls + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_points_played > data[4][seasonFinderOne].ca_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_points_played + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_o_points_played > data[4][seasonFinderOne].ca_o_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_o_points_played + '</td>' +
				                	'<td '; if (data[11][seasonFinderTwo].ca_d_points_played > data[4][seasonFinderOne].ca_d_points_played) { pcompTables += 'class="pcomp-greater"';}; pcompTables += '>' + data[11][seasonFinderTwo].ca_d_points_played + '</td>' +
				                '</tr>' +
	              			'</tbody>';
	          			};
	         		}; pcompTables += 
	      		'</table>';
	    	$('#pcomp-dataTables').html(pcompTables);
		};
	//End Tabled Data at the Bottom
// END PLAYER COMPARE

// SCHEDULE
	// Picking Data and Setup
		$(document).ready(function() {
	    	if($('#sch-container').length) {
	      		getSchedule('?sid=' + 4);
	      		extrasSchedule();
	    	};
		});
	  	var getSchedule = function(url) {
		    var sid = url || '';
		    $.ajax({
		    	url:"https://mlustats.herokuapp.com/api/schedule" + sid,
		    	type: "get",
		    	success:function(data){
		        	processDataSchedule(data[0]);
		    	}
		    });
		};
	// End Picking Data and Setup

	// Create Schedule
		var processDataSchedule = function(data) {
	    	var container = '<div id="sch-sat-table-wrap"><table id="loopTable">';
	    	var currentDay = '';
	    	var currentWeek = '';
	    	for (var i = 0; i < data.length; i++) {
		    	if (data[i].Date != currentDay) { var header = '</table>' +
			        '<table class="sch-sat-table'; if (currentWeek == data[i].Week) {header += ' sch_plus_space';}; header += '">' +
			        	'<caption>' + data[i].Day + ' ' + data[i].Date + ' - Week ' + data[i].Week + '</caption>' +
			        	'<thead>' +
			            	'<tr class="sch-header">' +
			            		'<th colspan="5" class="scheduleTableHeader matchup">Matchup</th>' +
			            		'<th class="scheduleTableHeader">';
			              		if (data[i].Status == "Final") { header +=
			              			'Result</th>' +
			                		'<th class="scheduleTableHeader hideSmall">Home POG</th>' +
			                		'<th class="scheduleTableHeader hideSmall">Away POG';
			              		} else { header +=
			              			'Tickets</th>' +
					                '<th class="scheduleTableHeader">Time</th>' +
					                '<th class="scheduleTableHeader hideSmall">Location';
			              		}; header +=
			              		'</th>' +
			            	'</tr>' +
			          	'</thead>' +
			          	'<tbody>';
				        currentDay = data[i].Date;
				        currentWeek = data[i].Week;
				        container += header;
		    	};
			    if (data[i].Status == "Final") { var row1 =
			        '<tr>' +
			    		'<td class="scheduleColumn scheduleTeamLogo"><a class="schedule_link" href="http:' + data[i].AwayTeamSite + '"><img class="scheduleImg" src="http://www.mlultimate.com' + data[i].AwayTeamPic + '"></a></td>' +
			        	'<td class="scheduleColumn scheduleTeamName"><a class="schedule_link" href="http:' + data[i].AwayTeamSite + '"><div class="ms-team-name-go'; if (data[i].ATF > data[i].HTF) { row1 += ' scheduleWin'}; row1 += '">' + data[i].AwayTeam + '</div></a></td>' +
			        	'<td class="scheduleColumn scheduleAt">AT</td>' +
			         	'<td class="scheduleColumn scheduleTeamLogo"><a class="schedule_link" href="http:' + data[i].HomeTeamSite + '"><img class="scheduleImg" src="http://www.mlultimate.com' + data[i].HomeTeamPic + '"></a></td>' +
			        	'<td class="scheduleColumn scheduleTeamName"><a class="schedule_link" href="http:' + data[i].HomeTeamSite + '"><div class="ms-team-name-go'; if (data[i].HTF > data[i].ATF) { row1 += ' scheduleWin'}; row1 += '">' + data[i].HomeTeam + '</div></a></td>' +
			        	'<td class="scheduleColumn"><a class="schedule_link" href="http://mlultimate.com/boxscore/?ga=' + data[i].GameID + '">' + data[i].ShortScore + '</a></td>' +
			        	'<td class="scheduleColumn scheduleHomePOG hideSmall"><a class="schedule_link" href="http://mlultimate.com/player/?pid=' + data[i].HomeTeamPOGID + '">' + data[i].HomeTeamPOG + '</a></td>' +
			        	'<td class="scheduleColumn scheduleAwayPOG hideSmall"><a class="schedule_link" href="http://mlultimate.com/player/?pid=' + data[i].AwayTeamPOGID + '">' + data[i].AwayTeamPOG + '</a></td>' +
			        '</tr>';
			        container += row1;
			    } else { var row2 =
		        	'<tr>' +
		        		'<td class="scheduleColumn scheduleTeamLogo"><a class="schedule_link" href="http:' + data[i].AwayTeamSite + '"><img class="scheduleImg" src="http://www.mlultimate.com' + data[i].AwayTeamPic + '"></a></td>' +
			        	'<td class="scheduleColumn scheduleTeamName"><a class="schedule_link" href="http:' + data[i].AwayTeamSite + '"><div class="ms-team-name-go">' + data[i].AwayTeam + '</div></a></td>' +
		        		'<td class="scheduleColumn scheduleAt">AT</td>' +
		        		'<td class="scheduleColumn scheduleTeamLogo"><a class="schedule_link" href="http:' + data[i].HomeTeamSite + '"><img class="scheduleImg" src="http://www.mlultimate.com' + data[i].HomeTeamPic + '"></a></td>' +
			        	'<td class="scheduleColumn scheduleTeamName"><a class="schedule_link" href="http:' + data[i].HomeTeamSite + '"><div class="ms-team-name-go">' + data[i].HomeTeam + '</div></a></td>' +
		          		'<td id="ms-tickets-id" class="scheduleColumn ms-tickets';
		            		if(data[i].Tickets == null) {row2 +=
		            			' tickets-coming-soon">' +
		                		'<span>Coming Soon</span>';
		            		} else {row2 +=
		            			' tickets-get-tickets">' +
		                		'<span><a class="unii-listing-button unii-red unii-medium" href="' + data[i].Tickets + '">Get Tickets</a></span>';
		            		}; row2 += 
		        		'</td>' +
		          		'<td class="scheduleColumn">' + data[i].Time + ' ' + data[i].TZ + '</td>' +
		          		'<td class="scheduleColumn hideSmall">' + data[i].Location + '</td>' +
		        	'</tr>';
		        	container += row2;
		    	};
	    	}; container +=
	    	'</tbody></table></div>';
		    $('.sk-fading-circle').hide();
		    $('#sch-container').show();
		    $('#sch-container').html(container);
		};
	// End Create Schedule

	// Extras
		var extrasSchedule = function() {
			$(document).on('change', '#seasonSelect', function() {
			    var val1 = $('#seasonSelect').val();
			    var val2 = $('#weekSelect').val();
			    $('.sk-fading-circle').show();
			    $('#sch-container').hide();
			    getSchedule('?sid=4&wid='+val2);
			});
			$(document).on('change', '#weekSelect', function() {
			    var val1 = $('#seasonSelect').val();
			    var val2 = $('#weekSelect').val();
			    $('.sk-fading-circle').show();
			    $('#sch-container').hide();
			    getSchedule('?sid=4&wid='+val2);
			});
		};
	// End Extras
// END SCHEDULE

// RECORDS
	// Picking Data and Setup
		$(document).ready(function() {
			if($('#recordsContent').length) {
				getRecordBook();
				extrasRecords();
			};
		});
		var getRecordBook = function(url) {
		    var sid = url || '';
		    $.ajax({
		        url:"https://mlustats.herokuapp.com/api/v1/records",
		        type: "get",
		        success:function(data){
		            processDataRecordBook(data);
		        }
		    });
		};
	// End Picking Data and Setup

	// Create Record Book
		var processDataRecordBook = function(data) { var recordsBox = 
			'<div id="rb-recordBook-box">' +
				'<div id="subtabs" class="subtabs">' +
					'<ul class="subtab-links">' +
			    		'<li class="active"><a href="#subtab1">Career</a></li>' +
			    		'<li><a href="#subtab2">Season</a></li>' +
			    		'<li><a href="#subtab3">Game</a></li>' +
			    	'</ul>' +
			    	'<div class="subtab-content">' +
					    '<div id="subtab1" class="subtab active">' +
					    	'<h2 class="recordsHeader">Points</h2>' +
					    	'<table id="rb-careerPoints" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career Points"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerPointsPlayerID + '">' + data[2][i].CareerPointsPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerPointsTotals + '</td>' +
						    				'<td>' + data[2][i].CareerPointsGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Goals</h2>' +
					    	'<table id="rb-careerGoals" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career Goals"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerGoalsPlayerID + '">' + data[2][i].CareerGoalsPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerGoalsTotals + '</td>' +
						    				'<td>' + data[2][i].CareerGoalsGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Assists</h2>' +
					    	'<table id="rb-careerAssists" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career Assists"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerAssistsPlayerID + '">' + data[2][i].CareerAssistsPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerAssistsTotals + '</td>' +
						    				'<td>' + data[2][i].CareerAssistsGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Blocks</h2>' +
					    	'<table id="rb-careerBlocks" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career Blocks"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerBlocksPlayerID + '">' + data[2][i].CareerBlocksPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerBlocksTotals + '</td>' +
						    				'<td>' + data[2][i].CareerBlocksGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Turnovers</h2>' +
					    	'<table id="rb-careerTurnovers" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career Turnovers"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerTurnoversPlayerID + '">' + data[2][i].CareerTurnoversPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerTurnoversTotals + '</td>' +
						    				'<td>' + data[2][i].CareerTurnoversGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">TPOP</h2>' +
					    	'<table id="rb-careerTpop" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career TPOP"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerTpopPlayerID + '">' + data[2][i].CareerTpopPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerTpopTotals + '</td>' +
						    				'<td>' + data[2][i].CareerTpopGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Throws</h2>' +
					    	'<table id="rb-careerThrows" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career Throws"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerThrowsPlayerID + '">' + data[2][i].CareerThrowsPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerThrowsTotals + '</td>' +
						    				'<td>' + data[2][i].CareerThrowsGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Catches</h2>' +
					    	'<table id="rb-careerCatches" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career Catches"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerCatchesPlayerID + '">' + data[2][i].CareerCatchesPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerCatchesTotals + '</td>' +
						    				'<td>' + data[2][i].CareerCatchesGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Bookends</h2>' +
					    	'<table id="rb-careerBookends" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career Bookends"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerBookendsPlayerID + '">' + data[2][i].CareerBookendsPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerBookendsTotals + '</td>' +
						    				'<td>' + data[2][i].CareerBookendsGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Callahans</h2>' +
					    	'<table id="rb-careerCallahans" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career Callahans"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerCallahansPlayerID + '">' + data[2][i].CareerCallahansPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerCallahansTotals + '</td>' +
						    				'<td>' + data[2][i].CareerCallahansGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Hockey Assists</h2>' +
					    	'<table id="rb-careerHockeyAssists" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career HockeyAssists"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerHockeyAssistsPlayerID + '">' + data[2][i].CareerHockeyAssistsPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerHockeyAssistsTotals + '</td>' +
						    				'<td>' + data[2][i].CareerHockeyAssistsGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Points Played</h2>' +
					    	'<table id="rb-careerPointsPlayed" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career PointsPlayed"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerPointsPlayedPlayerID + '">' + data[2][i].CareerPointsPlayedPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerPointsPlayedTotals + '</td>' +
						    				'<td>' + data[2][i].CareerPointsPlayedGamesPlayed + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Games Played</h2>' +
					    	'<table id="rb-careerGamesPlayed" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Career GamesPlayed"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[2].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[2][i].CareerGamesPlayedPlayerID + '">' + data[2][i].CareerGamesPlayedPlayerName + '</a></td>' +
						    				'<td>' + data[2][i].CareerGamesPlayedTotals + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
					    '</div>' + //End subtab 1
					    '<div id="subtab2" class="subtab">' +
					    	'<h2 class="recordsHeader">Points</h2>' +
					    	'<table id="rb-seasonPoints" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season Points"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonPointsPlayerID + '">' + data[1][i].SeasonPointsPlayerName + ' (' + data[1][i].SeasonPointsTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonPointsTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonPointsGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonPointsYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Goals</h2>' +
					    	'<table id="rb-seasonGoals" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season Goals"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonGoalsPlayerID + '">' + data[1][i].SeasonGoalsPlayerName + ' (' + data[1][i].SeasonGoalsTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonGoalsTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonGoalsGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonGoalsYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Assists</h2>' +
					    	'<table id="rb-seasonAssists" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season Assists"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonAssistsPlayerID + '">' + data[1][i].SeasonAssistsPlayerName + ' (' + data[1][i].SeasonAssistsTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonAssistsTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonAssistsGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonAssistsYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Blocks</h2>' +
					    	'<table id="rb-seasonBlocks" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season Blocks"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    			'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonBlocksPlayerID + '">' + data[1][i].SeasonBlocksPlayerName + ' (' + data[1][i].SeasonBlocksTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonBlocksTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonBlocksGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonBlocksYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Turnovers</h2>' +
					    	'<table id="rb-seasonTurnovers" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season Turnovers"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonTurnoversPlayerID + '">' + data[1][i].SeasonTurnoversPlayerName + ' (' + data[1][i].SeasonTurnoversTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonTurnoversTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonTurnoversGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonTurnoversYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">TPOP</h2>' +
					    	'<table id="rb-seasonTpop" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season TPOP"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonTpopPlayerID + '">' + data[1][i].SeasonTpopPlayerName + ' (' + data[1][i].SeasonTpopTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonTpopTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonTpopGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonTpopYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Throws</h2>' +
					    	'<table id="rb-seasonThrows" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season Throws"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonThrowsPlayerID + '">' + data[1][i].SeasonThrowsPlayerName + ' (' + data[1][i].SeasonThrowsTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonThrowsTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonThrowsGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonThrowsYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Catches</h2>' +
					    	'<table id="rb-seasonCatches" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season Catches"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonCatchesPlayerID + '">' + data[1][i].SeasonCatchesPlayerName + ' (' + data[1][i].SeasonCatchesTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonCatchesTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonCatchesGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonCatchesYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Bookends</h2>' +
					    	'<table id="rb-seasonBookends" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season Bookends"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonBookendsPlayerID + '">' + data[1][i].SeasonBookendsPlayerName + ' (' + data[1][i].SeasonBookendsTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonBookendsTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonBookendsGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonBookendsYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Callahans</h2>' +
					    	'<table id="rb-seasonCallahans" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season Callahans"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonCallahansPlayerID + '">' + data[1][i].SeasonCallahansPlayerName + ' (' + data[1][i].SeasonCallahansTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonCallahansTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonCallahansGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonCallahansYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Hockey Assists</h2>' +
					    	'<table id="rb-seasonHockeyAssists" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season HockeyAssists"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonHockeyAssistsPlayerID + '">' + data[1][i].SeasonHockeyAssistsPlayerName + ' (' + data[1][i].SeasonHockeyAssistsTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonHockeyAssistsTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonHockeyAssistsGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonHockeyAssistsYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Points Played</h2>' +
					    	'<table id="rb-seasonPointsPlayed" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Season PointsPlayed"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Games Played">GP</th>' +
					    				'<th>Year</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[1].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[1][i].SeasonPointsPlayedPlayerID + '">' + data[1][i].SeasonPointsPlayedPlayerName + ' (' + data[1][i].SeasonPointsPlayedTeam + ')</a></td>' +
						    				'<td>' + data[1][i].SeasonPointsPlayedTotals + '</td>' +
						    				'<td>' + data[1][i].SeasonPointsPlayedGamesPlayed + '</td>' +
						    				'<td>' + data[1][i].SeasonPointsPlayedYear + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			 '</tbody>' +
				    		'</table>' +
					    '</div>' + //End subtab 2
					    '<div id="subtab3" class="subtab">' +
					    	'<h2 class="recordsHeader">Points</h2>' +
					    	'<table id="rb-gamePoints" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game Points"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GamePointsPlayerID + '">' + data[0][i].GamePointsPlayerName + ' (' + data[0][i].GamePointsTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GamePointsTotals + '</td>' +
						    				'<td>' + data[0][i].GamePointsPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GamePointsGameID + '">' + data[0][i].GamePointsDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Goals</h2>' +
					    	'<table id="rb-gameGoals" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game Goals"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GameGoalsPlayerID + '">' + data[0][i].GameGoalsPlayerName + ' (' + data[0][i].GameGoalsTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GameGoalsTotals + '</td>' +
						    				'<td>' + data[0][i].GameGoalsPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GameGoalsGameID + '">' + data[0][i].GameGoalsDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Assists</h2>' +
					    	'<table id="rb-gameAssists" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game Assists"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GameAssistsPlayerID + '">' + data[0][i].GameAssistsPlayerName + ' (' + data[0][i].GameAssistsTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GameAssistsTotals + '</td>' +
						    				'<td>' + data[0][i].GameAssistsPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GameAssistsGameID + '">' + data[0][i].GameAssistsDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Blocks</h2>' +
					    	'<table id="rb-gameBlocks" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game Blocks"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GameBlocksPlayerID + '">' + data[0][i].GameBlocksPlayerName + ' (' + data[0][i].GameBlocksTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GameBlocksTotals + '</td>' +
						    				'<td>' + data[0][i].GameBlocksPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GameBlocksGameID + '">' + data[0][i].GameBlocksDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Turnovers</h2>' +
					    	'<table id="rb-gameTurnovers" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game Turnovers"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GameTurnoversPlayerID + '">' + data[0][i].GameTurnoversPlayerName + ' (' + data[0][i].GameTurnoversTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GameTurnoversTotals + '</td>' +
						    				'<td>' + data[0][i].GameTurnoversPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GameTurnoversGameID + '">' + data[0][i].GameTurnoversDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">TPOP</h2>' +
					    	'<table id="rb-gameTpop" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game TPOP"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GameTpopPlayerID + '">' + data[0][i].GameTpopPlayerName + ' (' + data[0][i].GameTpopTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GameTpopTotals + '</td>' +
						    				'<td>' + data[0][i].GameTpopPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GameTpopGameID + '">' + data[0][i].GameTpopDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Throws</h2>' +
					    	'<table id="rb-gameThrows" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game Throws"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GameThrowsPlayerID + '">' + data[0][i].GameThrowsPlayerName + ' (' + data[0][i].GameThrowsTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GameThrowsTotals + '</td>' +
						    				'<td>' + data[0][i].GameThrowsPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GameThrowsGameID + '">' + data[0][i].GameThrowsDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Catches</h2>' +
					    	'<table id="rb-gameCatches" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game Catches"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GameCatchesPlayerID + '">' + data[0][i].GameCatchesPlayerName + ' (' + data[0][i].GameCatchesTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GameCatchesTotals + '</td>' +
						    				'<td>' + data[0][i].GameCatchesPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GameCatchesGameID + '">' + data[0][i].GameCatchesDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Bookends</h2>' +
					    	'<table id="rb-gameBookends" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game Bookends"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GameBookendsPlayerID + '">' + data[0][i].GameBookendsPlayerName + ' (' + data[0][i].GameBookendsTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GameBookendsTotals + '</td>' +
						    				'<td>' + data[0][i].GameBookendsPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GameBookendsGameID + '">' + data[0][i].GameBookendsDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Callahans</h2>' +
					    	'<table id="rb-gameCallahans" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game Callahans"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GameCallahansPlayerID + '">' + data[0][i].GameCallahansPlayerName + ' (' + data[0][i].GameCallahansTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GameCallahansTotals + '</td>' +
						    				'<td>' + data[0][i].GameCallahansPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GameCallahansGameID + '">' + data[0][i].GameCallahansDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Hockey Assists</h2>' +
					    	'<table id="rb-gameHockeyAssists" class="recordsTable left">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game HockeyAssists"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th title="Points Played">PP</th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GameHockeyAssistsPlayerID + '">' + data[0][i].GameHockeyAssistsPlayerName + ' (' + data[0][i].GameHockeyAssistsTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GameHockeyAssistsTotals + '</td>' +
						    				'<td>' + data[0][i].GameHockeyAssistsPointsPlayed + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GameHockeyAssistsGameID + '">' + data[0][i].GameHockeyAssistsDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
				    		'<h2 class="recordsHeader">Points Played</h2>' +
					    	'<table id="rb-gamePointsPlayed" class="recordsTable right">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th>#</th>' +
					    				'<th>Player</th>' +
					    				'<th title="Game PointsPlayed"><span class="hideSmall">Record</span><span class="showBig">#</span></th>' +
					    				'<th>Date</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
					    			for (var i = 0; i < data[0].length; i++) { recordsBox +=
					    				'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http://mlultimate.com/player/?pid=' + data[0][i].GamePointsPlayedPlayerID + '">' + data[0][i].GamePointsPlayedPlayerName + ' (' + data[0][i].GamePointsPlayedTeam + ')</a></td>' +
						    				'<td>' + data[0][i].GamePointsPlayedTotals + '</td>' +
						    				'<td><a href="http://mlultimate.com/boxscore/?ga=' + data[0][i].GamePointsPlayedGameID + '">' + data[0][i].GamePointsPlayedDate + '</td>' +
					    				'</tr>';
				    				}; recordsBox +=
				    			'</tbody>' +
				    		'</table>' +
					    '</div>' + //End subtab 3
					'</div>' + //End subtab-content
				'</div>' + //End subtabs
			'</div>';//End rb-recordBook-box
			$('.sk-fading-circle').hide();
		    $('#recordsContent').show();
			$('#recordsContent').html(recordsBox);
		};
	// End Create Record Book

	// Extras
		var extrasRecords = function() {
			$(document).on('click', '.subtabs .subtab-links a', function(e2) {
				var currentAttrValue2 = $(e2.target).attr('href');
				$('.subtabs ' + currentAttrValue2).show().siblings().hide();
				$(e2.target).parent('li').addClass('active').siblings().removeClass('active');
				e2.preventDefault();
			});
		};
	// End Extras
// END RECORDS

// SCORES
	// Picking Data and Setup
	    $(document).ready(function() {
	        if($('#sar-container').length) {
	            getScores('?sid=' + 4 + 'wid=');
	            extrasScores();
	        };
	    });
	    var getScores = function(url) {
	        var sid = url || '';
	        $.ajax({
	            url:"https://mlustats.herokuapp.com/api/schedule" + sid,
	            type: "get",
	            success:function(data){
	                processDataScores(data[0]);
	            }
	        });
	    };
	// End Picking Data and Setup

	// Create Scores
	    var processDataScores = function(data) { var scores = '';
	        for (var i = 0; i < data.length; i++) { scores +=
	            '<div class="sch-container">' +
	            	'<p class="sch-time">' + data[i].StartTime + '</p>' +
	                '<div class="sch-row">' +
	                    '<div class="sch-row-unit sch-row-unit--score">' +
	                        '<table class="sch-table">' +
	                            '<thead>' +
	                                '<th colspan="2">' + data[i].Status + '</th>' +
	                                '<th>1</th>' +
	                                '<th>2</th>' +
	                                '<th>3</th>' +
	                                '<th>4</th>';
	                                if (data[i].HTOT + data[i].ATOT > 0) { scores +=
	                                	'<th>OT</th>';
	                                }; scores +=
	                                '<th>T</th>' +
	                            '</thead>' +
	                            '<tbody>' +
	                                '<tr class="sch-tr-away-nt">' +
	                                    '<td class="sch-td-team-nt"><a href="http:' + data[i].AwayTeamSite + '" target="_blank"><img src="http://www.mlultimate.com' + data[i].AwayTeamPic + '" class="sch-td-team-img"></a></td>' +
	                                    '<td ckass="sch-td-team-name-nt"><a href="http:' + data[i].AwayTeamSite + '" target="_blank">' + data[i].AwayTeam + ' ' + data[i].ATRecord + '</a></td>' +
	                                    '<td class="sch-td-quarter-nt">' + data[i].ATQ1 + '</td>' +
	                                    '<td class="sch-td-quarter-nt">' + data[i].ATQ2 + '</td>' +
	                                    '<td class="sch-td-quarter-nt">' + data[i].ATQ3 + '</td>' +
	                                    '<td class="sch-td-quarter-nt">' + data[i].ATQ4 + '</td>';
	                                    if (data[i].HTOT + data[i].ATOT > 0) { scores +=
	                                    	'<td class="sch-td-quarter">' + data[i].ATOT + '</td>';
	                                    }; scores +=
	                                    '<td class="sch-td-total">' + data[i].ATF + '</td>' +
	                                '</tr>' +
	                                '<tr class="sch-tr-home-nt">' + 
	                                    '<td class="sch-td-team-nt"><a href="http:' + data[i].HomeTeamSite + '" target="_blank"><img src="http://www.mlultimate.com' + data[i].HomeTeamPic + '" class="sch-td-team-img"></a></td>' +
	                                    '<td ckass="sch-td-team-name-nt"><a href="http:' + data[i].AwayTeamSite + '" target="_blank">' + data[i].HomeTeam + ' ' + data[i].HTRecord + '</a></td>' +
	                                    '<td class="sch-td-quarter-nt">' + data[i].HTQ1 + '</td>' +
	                                    '<td class="sch-td-quarter-nt">' + data[i].HTQ2 + '</td>' +
	                                    '<td class="sch-td-quarter-nt">' + data[i].HTQ3 + '</td>' +
	                                    '<td class="sch-td-quarter-nt">' + data[i].HTQ4 + '</td>';
	                                    if (data[i].HTOT + data[i].ATOT > 0) { scores +=
	                                    	'<td class="sch-td-quarter">' + data[i].HTOT + '</td>';
	                                    }; scores +=
	                                    '<td class="sch-td-total">' + data[i].HTF + '</td>' +
	                                '</tr>' +
	                            '</tbody>' +
	                        '</table>' +
	                    '</div>' +
	                    '<div class="sch-row-unit sch-row-unit--video">';
	                        if (data[i].Highlight == null) { scores +=
	                        	'<img src="http://www.mlultimate.com/wp-content/images/highlightsNo.png">';
	                       } else { scores +=
	                       	'<a href="' + data[i].Highlight + '"><img src="http://www.mlultimate.com/wp-content/images/highlightsYes.png"></a>';
	                       }; scores +=
	                    '</div>' +
	                    '<div class="sch-row-unit sch-row-unit--performers">' +
	                        '<p>' + data[i].Header + '</p>' +
	                        '<ul class="sch-players-list">' +
	                            '<li><a href="http://mlultimate.com/player/?pid=' + data[i].ReceivingID + '">' + data[i].Receiving + '</a></li>' +
	                            '<li><a href="http://mlultimate.com/player/?pid=' + data[i].ThrowingID + '">' + data[i].Throwing + '</a></li>' +
	                            '<li><a href="http://mlultimate.com/player/?pid=' + data[i].DefenseID + '">' + data[i].Defense + '</a></li>' +
	                        '</ul>' +
	                    '</div>' +
	                    '<div class="sch-row-unit sch-row-unit--buttons';
	                        if (data[i].HTF > 0) {
	                            if (data[i].FullGame == null) { scores +=
	                            	'"> <a href="http://tinyurl.com/rrgamerecaptest' + data[i].GameID + '" class="sch-button sch-shrunkButton">Rapid Reaction</a>';
	                            } else { scores +=
	                            	'"> <a href="http://tinyurl.com/gamerecaptest' + data[i].GameID + '" class="sch-button sch-shrunkButton">Recap</a>';
	                            }; scores +=
	                            '<a href="http://mlultimate.com/boxscore/?ga=' + data[i].GameID + '" class="sch-button sch-shrunkButton">Box Score</a>';
	                            if (data[i].FullGame == null) { scores +=
	                            	'<a class="sch-button sch-shrunkButton">Video Unavailable</a>';
	                            } else { scores +=
	                            	'<a href="' + data[i].FullGame + '" class="sch-button sch-shrunkButton">Watch Game</a>';
	                            };
	                        } else {
	                            if(data[i].Tickets == null) { scores +=
	                            	' tickets-coming-soon">' +
	                                '<span>Coming Soon</span>';
	                            } else { scores +=
	                            	' tickets-get-tickets">' +
	                                '<span><a class="unii-listing-button unii-red unii-medium" href="' + data[i].Tickets + '">Get Tickets</a></span>';
	                            };
	                        }; scores +=
	                    '</div>' +
	                '</div>' +
	            '</div>';
	            if (data[i].HTF > data[i].ATF) {
	                $("tr.sch-tr-home").addClass("win");
	                $("tr.sch-tr-away").addClass("loss");
	            } else if (data[i].ATF > data[i].HTF) {
	                $("tr.sch-tr-away").addClass("win");
	                $("tr.sch-tr-home").addClass("loss");
	            };
	        };
	        $('.sk-fading-circle').hide();
	        $('#sar-container').show();
	        $('#sar-container').html(scores);
	    };
	// End Create Scores

	// Extras
		var extrasScores = function() {
		    $(document).on('change', '#seasonSelectScores', function() {
		        var val1 = $('#seasonSelectScores').val();
		        var val2 = $('#weekSelectScores').val();
		        $('.sk-fading-circle').show();
		        $('#sar-container').hide();
		        getScores('?sid=' + val1 + '&wid=' + val2);
		    });
		    $(document).on('change', '#weekSelectScores', function() {
		        var val1 = $('#seasonSelectScores').val();
		        var val2 = $('#weekSelectScores').val();
		        $('.sk-fading-circle').show();
		        $('#sar-container').hide();
		        getScores('?sid=' + val1 + '&wid=' + val2);
		    });
		};
	// End Extras
// END SCORES

// STANDINGS
	// Picking Data and Setup
		$(document).ready(function() {
			if($('#standingsContent').length) {
				getStatsStandings('?sid='+ 4);
				standingsExtras();
			};
		});
		var getStatsStandings = function(url) {
			var sid = url || '';
			$.ajax({
				url:"https://mlustats.herokuapp.com/api/standings" + sid,
				type: "get",
				success:function(data){
					processDataStandings(data);
				},
			});
		};
	// End Picking Data and Setup

	// Create Standings
		var processDataStandings = function(data) { var standingsbox =
			'<div id="st-standings-box">' +
				'<div id="subtabs" class="subtabs">' +
					'<ul class="subtab-links">' +
			    		'<li class="active"><a href="#subtab1">Standings</a></li>' +
			    		'<li><a href="#subtab2">Team Stats</a></li>' +
			    	'</ul>' +
			    	'<div class="subtab-content">' +
					    '<div id="subtab1" class="subtab active">' +
					    	'<p class="bs-team-name">East</p>' +
					    	'<table id="standingsEast" class="standingsTable">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th title="Number" class="std-number">#</th>' +
					    				'<th title="Team Name" class="std-team-name-th">TEAM</th>' +
					    				'<th title="Wins" class="std-wins">W</th>' +
					    				'<th title="Losses" class="std-losses">L</th>' +
					    				'<th title="Winning Percentage" class="std-wp">W%</th>' +
					    				'<th title="Goals For" class="std_gf">GF</th>' +
					    				'<th title="Goals Against" class="std_ga">GA</th>' +
					    				'<th title="Home Record" class="std_hr hideSmall">HOME</th>' +
					    				'<th title="Away Record" class="std_ar hideSmall">AWAY</th>' +
					    				'<th title="Current Streak" class="std_stk">STREAK</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
						    		for (var i = 0; i < data[0].length; i++) { standingsbox +=
						    			'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http:'+ data[0][i].te_site_path + '"><img src="http:' + data[0][i].te_pic_schedule + '" class="std_logo"><span class="std-team-name">' + data[0][i].Team + '</span></a></td>' +
						    				'<td class="std_wins">' + data[0][i].Wins + '</td>' +
						    				'<td class="std_losses">' + data[0][i].Losses + '</td>' +
						    				'<td class="std_wp">' + data[0][i].WinPer + '</td>' +
						    				'<td class="std_gf">' + data[0][i].GoalsFor + '</td>' +
						    				'<td class="std_ga">' + data[0][i].GoalsAgainst + '</td>' +
						    				'<td class="std_hr hideSmall">' + data[0][i].HomeRecord + '</td>' +
						    				'<td class="std_ar hideSmall">' + data[0][i].AwayRecord + '</td>' +
						    				'<td class="std_stk">' + data[0][i].Streak + '</td>' +
						    			'</tr>';
						    		}; standingsbox +=
					    		'</tbody>' +
					    	'</table>' +
					    	'<p class="bs-team-name">West</p>' +
					    	'<table id="standingsWest" class="standingsTable">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th title="Number" class="std-number">#</th>' +
					    				'<th title="Team Name" class="std-team-name-th">TEAM</th>' +
					    				'<th title="Wins" class="std-wins">W</th>' +
					    				'<th title="Losses" class="std-losses">L</th>' +
					    				'<th title="Winning Percentage" class="std-wp">W%</th>' +
					    				'<th title="Goals For" class="std_gf">GF</th>' +
					    				'<th title="Goals Against" class="std_ga">GA</th>' +
					    				'<th title="Home Record" class="std_hr hideSmall">HOME</th>' +
					    				'<th title="Away Record" class="std_ar hideSmall">AWAY</th>' +
					    				'<th title="Current Streak" class="std_stk">STREAK</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
						    		for (var i = 0; i < data[1].length; i++) { standingsbox +=
						    			'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http:'+ data[1][i].te_site_path + '"><img src="http:' + data[1][i].te_pic_schedule + '" class="std_logo"><span class="std-team-name">' + data[1][i].Team + '</span></a></td>' +
						    				'<td class="std_wins">' + data[1][i].Wins + '</td>' +
						    				'<td class="std_losses">' + data[1][i].Losses + '</td>' +
						    				'<td class="std_wp">' + data[1][i].WinPer + '</td>' +
						    				'<td class="std_gf">' + data[1][i].GoalsFor + '</td>' +
						    				'<td class="std_ga">' + data[1][i].GoalsAgainst + '</td>' +
						    				'<td class="std_hr hideSmall">' + data[1][i].HomeRecord + '</td>' +
						    				'<td class="std_ar hideSmall">' + data[1][i].AwayRecord + '</td>' +
						    				'<td class="std_stk">' + data[1][i].Streak + '</td>' +
						    			'</tr>';
						    		}; standingsbox +=
					    		'</tbody>' +
					    	'</table>' +
					    '</div>' + //close tab1
					    '<div id="subtab2" class="subtab">' +
					    	'<p class="bs-team-name">East</p>' +
					    	'<table id="teamstatsEast" class="teamstatsTable">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th title="Number" class="std-number">#</th>' +
					    				'<th title="Team Name" class="std-team-name-th">TEAM</th>' +
					    				'<th title="Goals For">GF</th>' +
					    				'<th title="Goals Against">GA</th>' +
					    				'<th title="Blocks">B</th>' +
					    				'<th title="Turnovers">T</th>' +
					    				'<th title="Completion Percentage">Comp %</th>' +
					    				'<th class="hideSmall" title="Total Scoring Efficiency">TSE</th>' +
					    				'<th class="hideSmall" title="Offensive Scoring Efficiency">OSE</th>' +
					    				'<th class="hideSmall" title="Hold Possession Scoring Efficiency">HPSE</th>' +
					    				'<th class="hideSmall" title="First Hold Scoring Efficiency">FHSE</th>' +
					    				'<th class="hideSmall" title="Defensive Scoring Efficiency">DSE</th>' +
					    				'<th class="hideSmall" title="Break Possession Scoring Efficiency">BPSE</th>' +
					    				'<th class="hideSmall" title="First Break Scoring Efficiency">FBSE</th>' +
					    				'<th class="hideSmall" title="Defensive Turnover Efficiency">DTE</th>' +
					    				'<th title="Touches Per Offensive Possession">TPOP</th>' +
					    			'</tr>' +
					    		'</thead>' +
						    	'<tbody>';
						    		for (var i = 0; i < data[0].length; i++) { standingsbox +=
						    			'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http:'+ data[0][i].te_site_path + '"><img src="http:' + data[0][i].te_pic_schedule + '" class="std_logo"><span class="std-team-name">' + data[0][i].Team + '</span></a></td>' +
						    				'<td class="std_gf">' + data[0][i].GoalsFor + '</td>' +
						    				'<td class="std_ga">' + data[0][i].GoalsAgainst + '</td>' +
						    				'<td class="std_b">' + data[0][i].Blocks + '</td>' +
						    				'<td class="std_t">' + data[0][i].Turns + '</td>' +
						    				'<td class="std_compp">' + data[0][i].CompletionPer + '%</td>' +
						    				'<td class="std_ose hideSmall">' + data[0][i].TSE + '%</td>' +
						    				'<td class="std_ose hideSmall">' + data[0][i].OSE + '%</td>' +
						    				'<td class="std_dtse hideSmall">' + data[0][i].HPSE + '%</td>' +
						    				'<td class="std_dtse hideSmall">' + data[0][i].FHSE + '%</td>' +
						    				'<td class="std_dse hideSmall">' + data[0][i].DSE + '%</td>' +
						    				'<td class="std_dtse hideSmall">' + data[0][i].BPSE + '%</td>' +
						    				'<td class="std_dtse hideSmall">' + data[0][i].FBSE + '%</td>' +
						    				'<td class="std_dte hideSmall">' + data[0][i].DTE + '%</td>' +
						    				'<td class="std_tpop">' + data[0][i].TPOP + '</td>' +
						    			'</tr>';
						    		}; standingsbox +=
					    		'</tbody>' +
					    	'</table>' +
					    	'<p class="bs-team-name">West</p>' +
					    	'<table id="teamstatsWest" class="teamstatsTable">' +
					    		'<thead>' +
					    			'<tr>' +
					    				'<th title="Number" class="std-number">#</th>' +
					    				'<th title="Team Name" class="std-team-name-th">TEAM</th>' +
					    				'<th title="Goals For">GF</th>' +
					    				'<th title="Goals Against">GA</th>' +
					    				'<th title="Blocks">B</th>' +
					    				'<th title="Turnovers">T</th>' +
					    				'<th title="Completion Percentage">Comp %</th>' +
					    				'<th class="hideSmall" title="Total Scoring Efficiency">TSE</th>' +
					    				'<th class="hideSmall" title="Offensive Scoring Efficiency">OSE</th>' +
					    				'<th class="hideSmall" title="Hold Possession Scoring Efficiency">HPSE</th>' +
					    				'<th class="hideSmall" title="First Hold Scoring Efficiency">FHSE</th>' +
					    				'<th class="hideSmall" title="Defensive Scoring Efficiency">DSE</th>' +
					    				'<th class="hideSmall" title="Break Possession Scoring Efficiency">BPSE</th>' +
					    				'<th class="hideSmall" title="First Break Scoring Efficiency">FBSE</th>' +
					    				'<th class="hideSmall" title="Defensive Turnover Efficiency">DTE</th>' +
					    				'<th title="Touches Per Offensive Possession">TPOP</th>' +
					    			'</tr>' +
					    		'</thead>' +
					    		'<tbody>';
						    		for (var i = 0; i < data[1].length; i++) { standingsbox +=
						    			'<tr>' +
						    				'<td>' + (i+1) + '</td>' +
						    				'<td><a href="http:'+ data[1][i].te_site_path + '"><img src="http:' + data[1][i].te_pic_schedule + '" class="std_logo"><span class="std-team-name">' + data[1][i].Team + '</span></a></td>' +
						    				'<td class="std_gf">' + data[1][i].GoalsFor + '</td>' +
						    				'<td class="std_ga">' + data[1][i].GoalsAgainst + '</td>' +
						    				'<td class="std_b">' + data[1][i].Blocks + '</td>' +
						    				'<td class="std_t">' + data[1][i].Turns + '</td>' +
						    				'<td class="std_compp">' + data[1][i].CompletionPer + '%</td>' +
						    				'<td class="std_ose hideSmall">' + data[1][i].TSE + '%</td>' +
						    				'<td class="std_ose hideSmall">' + data[1][i].OSE + '%</td>' +
						    				'<td class="std_dtse hideSmall">' + data[1][i].HPSE + '%</td>' +
						    				'<td class="std_dtse hideSmall">' + data[1][i].FHSE + '%</td>' +
						    				'<td class="std_dse hideSmall">' + data[1][i].DSE + '%</td>' +
						    				'<td class="std_dtse hideSmall">' + data[1][i].BPSE + '%</td>' +
						    				'<td class="std_dtse hideSmall">' + data[1][i].FBSE + '%</td>' +
						    				'<td class="std_dte hideSmall">' + data[1][i].DTE + '%</td>' +
						    				'<td class="std_tpop">' + data[1][i].TPOP + '</td>' +
						    			'</tr>';
						    		}; standingsbox +=
					    		'</tbody>' +
					    	'</table>' +
					    '</div>' + //close tab2
					'</div>' + //close tab-content
				'</div>' +
			'</div>';
			$('.sk-fading-circle').hide();
		    $('#standingsContent').show();
			$('#standingsContent').html(standingsbox);
		};
	// End Create Standings

	// Extras
		var standingsExtras = function() {
			$(document).on('click', '.subtabs .subtab-links a', function(e2) {
				var currentAttrValue2 = $(e2.target).attr('href');
				$('.subtabs ' + currentAttrValue2).show().siblings().hide();
				$(e2.target).parent('li').addClass('active').siblings().removeClass('active');
				e2.preventDefault();
			});
			$(document).on('change', '#seasonSelectStandings', function() {
				var val = $('#seasonSelectStandings').val();
			    $('.sk-fading-circle').show();
			    $('#standingsContent').hide();
			    getStatsStandings('?sid='+ val);
			});
		};
	// End Extras
// END STANDINGS