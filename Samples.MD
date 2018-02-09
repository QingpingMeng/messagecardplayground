Some sample payloads:

## Flight Itinerary
```
{
	"cardName": "Flight Itinerary",
	"body": [
		{
			"type": "TextBlock",
			"text": "Passengers",
			"weight": "bolder",
			"isSubtle": false
		},
		{
			"type": "TextBlock",
			"text": "Sarah Hum",
			"separator": true
		},
		{
			"type": "TextBlock",
			"text": "Jeremy Goldberg",
			"spacing": "none"
		},
		{
			"type": "TextBlock",
			"text": "Evan Litvak",
			"spacing": "none"
		},
		{
			"type": "TextBlock",
			"text": "2 Stops",
			"weight": "bolder",
			"spacing": "medium"
		},
		{
			"type": "TextBlock",
			"text": "Fri, October 10 8:30 AM",
			"weight": "bolder",
			"spacing": "none"
		},
		{
			"type": "ColumnSet",
			"separator": true,
			"columns": [
				{
					"type": "Column",
					"width": 1,
					"items": [
						{
							"type": "TextBlock",
							"text": "San Francisco",
							"isSubtle": true
						},
						{
							"type": "TextBlock",
							"size": "extraLarge",
							"color": "accent",
							"text": "SFO",
							"spacing": "none"
						}
					]
				},
				{
					"type": "Column",
					"width": "auto",
					"items": [
						{
							"type": "TextBlock",
							"text": " "
						},
						{
							"type": "Image",
							"url": "http://messagecardplayground.azurewebsites.net/assets/airplane.png",
							"size": "small",
							"spacing": "none"
						}
					]
				},
				{
					"type": "Column",
					"width": 1,
					"items": [
						{
							"type": "TextBlock",
							"horizontalAlignment": "right",
							"text": "Amsterdam",
							"isSubtle": true
						},
						{
							"type": "TextBlock",
							"horizontalAlignment": "right",
							"size": "extraLarge",
							"color": "accent",
							"text": "AMS",
							"spacing": "none"
						}
					]
				}
			]
		},
		{
			"type": "TextBlock",
			"text": "Non-Stop",
			"weight": "bolder",
			"spacing": "medium"
		},
		{
			"type": "TextBlock",
			"text": "Fri, October 18 9:50 PM",
			"weight": "bolder",
			"spacing": "none"
		},
		{
			"type": "ColumnSet",
			"separator": true,
			"columns": [
				{
					"type": "Column",
					"width": 1,
					"items": [
						{
							"type": "TextBlock",
							"text": "Amsterdam",
							"isSubtle": true
						},
						{
							"type": "TextBlock",
							"size": "extraLarge",
							"color": "accent",
							"text": "AMS",
							"spacing": "none"
						}
					]
				},
				{
					"type": "Column",
					"width": "auto",
					"items": [
						{
							"type": "TextBlock",
							"text": " "
						},
						{
							"type": "Image",
							"url": "http://messagecardplayground.azurewebsites.net/assets/airplane.png",
							"size": "small",
							"spacing": "none"
						}
					]
				},
				{
					"type": "Column",
					"width": 1,
					"items": [
						{
							"type": "TextBlock",
							"horizontalAlignment": "right",
							"text": "San Francisco",
							"isSubtle": true
						},
						{
							"type": "TextBlock",
							"horizontalAlignment": "right",
							"size": "extraLarge",
							"color": "accent",
							"text": "SFO",
							"spacing": "none"
						}
					]
				}
			]
		},
		{
			"type": "ColumnSet",
			"spacing": "medium",
			"columns": [
				{
					"type": "Column",
					"width": "1",
					"items": [
						{
							"type": "TextBlock",
							"text": "Total",
							"size": "medium",
							"isSubtle": true
						}
					]
				},
				{
					"type": "Column",
					"width": 1,
					"items": [
						{
							"type": "TextBlock",
							"horizontalAlignment": "right",
							"text": "$4,032.54",
							"size": "medium",
							"weight": "bolder"
						}
					]
				}
			]
		}
	],
	"actions": null,
	"type": "AdaptiveCard",
	"id": "427FB9DB-E2E6-4A26-B684-454D6B62A731",
	"correlationId": "fcd657bf-5d59-4954-a74f-89930b890940",
	"originator": null,
	"hideOriginalBody": false,
	"enableBodyToggling": false,
	"expectedActors": null,
	"messageCardContext": {
		"correlationId": "fcd657bf-5d59-4954-a74f-89930b890940",
		"messageCardSource": "AdaptiveCard",
		"oamAppName": null
	},
	"resources": null,
	"autoInvokeAction": null,
	"autoInvokeOptions": null,
	"speak": "Your flight is confirmed for you and 3 other passengers from San Francisco to Amsterdam on Friday, October 10 8:30 AM",
	"title": null,
	"backgroundImage": null,
	"version": "1.0",
	"minVersion": null,
	"fallbackText": null,
	"theme": null
}
```

## Calendar Reminder
```
{
	"type": "AdaptiveCard",
	"cardName": "Calendar Reminder",
	"body": [
		{
			"size": "large",
			"weight": "bolder",
			"text": "Adaptive Card design session",
			"type": "TextBlock"
		},
		{
			"isSubtle": true,
			"text": "Conf Room 112/3377 (10)",
			"type": "TextBlock"
		},
		{
			"isSubtle": true,
			"text": "12:30 PM - 1:30 PM",
			"separation": 1,
			"type": "TextBlock"
		},
		{
			"text": "Snooze for",
			"type": "TextBlock"
		},
		{
			"Style": 1,
			"choices": [
				{
					"title": "5 minutes",
					"value": "5",
					"isSelected": true
				},
				{
					"title": "15 minutes",
					"value": "15"
				},
				{
					"title": "30 minutes",
					"value": "30"
				}
			],
			"id": "snooze",
			"type": "Input.ChoiceSet"
		}
	],
	"actions": [
		{
			"method": "POST",
			"url": "http://foo.com",
			"title": "Snooze",
			"type": "Action.Http"
		},
		{
			"method": "POST",
			"url": "http://foo.com",
			"title": "I'll be late",
			"type": "Action.Http"
		},
		{
			"method": "POST",
			"url": "http://foo.com",
			"title": "Dismiss",
			"type": "Action.Http"
		}
	],
	"speak": "<s>Your  meeting about \"Adaptive Card design session\"<break strength='weak'/> is starting at 12:30pm</s><s>Do you want to snooze <break strength='weak'/> or do you want to send a late notification to the attendees?</s>",
	"version": "1.0"
}
```

## Tiny Pulse
```
{
	"type": "AdaptiveCard",
	"cardName": "Tiny Pulse",
	"version": "1.0",
	"body": [
		{
			"items": [
				{
					"text": "All survey responses are anonymous. [Learn more](http://www.tinypulse.com)",
					"horizontalAlignment": "center",
					"wrap": true,
					"type": "TextBlock"
				}
			],
			"style": "emphasis",
			"type": "Container"
		},
		{
			"url": "https://cdn2.hubspot.net/hubfs/443262/header_assets/engage_logo.png?t=1459547965461",
			"horizontalAlignment": "center",
			"type": "Image"
		},
		{
			"url": "http://messagecardplayground.azurewebsites.net/assets/TINYPulseQuestionIcon.png",
			"horizontalAlignment": "center",
			"type": "Image"
		},
		{
			"size": "large",
			"text": "**How likely would you be to refer someone to work here?**",
			"horizontalAlignment": "center",
			"wrap": true,
			"type": "TextBlock"
		},
		{
			"choices": [
				{
					"title": "1 - Extremely unlikely \"I would physically deter them down to my last breath\"",
					"value": "1"
				},
				{
					"title": "2",
					"value": "2"
				},
				{
					"title": "3",
					"value": "3"
				},
				{
					"title": "4",
					"value": "4"
				},
				{
					"title": "5",
					"value": "5"
				},
				{
					"title": "6",
					"value": "6"
				},
				{
					"title": "7",
					"value": "7"
				},
				{
					"title": "8",
					"value": "8"
				},
				{
					"title": "9",
					"value": "9"
				},
				{
					"title": "10 - Extremely likely (\"It's the best place to work\")",
					"value": "10"
				}
			],
			"type": "Input.ChoiceSet"
		},
		{
			"actions": [
				{
					"title": "Submit",
					"type": "Action.Http"
				}
			],
			"horizontalAlignment": "center",
			"type": "ActionSet"
		},
		{
			"text": "**Streak**",
			"horizontalAlignment": "center",
			"type": "TextBlock"
		},
		{
			"size": "extraLarge",
			"text": "**0**",
			"horizontalAlignment": "center",
			"type": "TextBlock"
		},
		{
			"text": "surveys in a row",
			"horizontalAlignment": "center",
			"type": "TextBlock"
		},
		{
			"items": [
				{
					"text": "Having trouble? [Click here](http://www.tinypulse.com) to go to TINYPulse to respond",
					"horizontalAlignment": "center",
					"wrap": true,
					"type": "TextBlock"
				}
			],
			"style": "emphasis",
			"type": "Container"
		}
	]
}
```
## Toggle Visibility
```
{
	"cardName": "Toggle Visibility",
	"body": [
		{
			"type": "Container",
			"style": "emphasis",
			"items": [
				{
					"type": "ColumnSet",
					"columns": [
						{
							"width": "auto",
							"items": [
								{
									"type": "Image",
									"style": "person",
									"pixelWidth": 50,
									"url": "http://connectorsdemo.azurewebsites.net/images/MSC12_Oscar_002.jpg"
								}
							]
						},
						{
							"width": "stretch",
							"spacing": "padding",
							"items": [
								{
									"type": "TextBlock",
									"color": "light",
									"text": "**New opportunity created**",
									"size": "large"
								},
								{
									"type": "TextBlock",
									"color": "light",
									"spacing": "none",
									"text": "by Miguel Garcia on {{DATE(2017-09-20T16:00:00Z,Long)}}"
								}
							]
						}
					]
				}
			]
		},
		{
			"type": "TextBlock",
			"text": "**Title:**"
		},
		{
			"type": "Input.Text",
			"id": "title",
			"placeholder": "Title",
			"value": "Brown Industries time machine"
		},
		{
			"type": "TextBlock",
			"text": "**Description:**"
		},
		{
			"type": "Input.Text",
			"id": "description",
			"isMultiline": true,
			"value": "Brown Industries is looking for an affordable Flux Capacitor that can be mass produced. Big potential. It's us vs Tannen Corp,. at this point, but our product is smaller and fits better in a DeLorean."
		},
		{
			"type": "TextBlock",
			"text": "**Stage:**"
		},
		{
			"type": "Input.ChoiceSet",
			"id": "stage",
			"choices": [
				{
					"title": "Prospecting",
					"value": "1"
				},
				{
					"title": "Qualification",
					"value": "2"
				},
				{
					"title": "Negotiation Review",
					"value": "3"
				},
				{
					"title": "Closed Won",
					"value": "4"
				},
				{
					"title": "Closed Loss",
					"value": "5"
				}
			],
			"value": "1"
		},
		{
			"type": "Container",
			"selectAction": {
				"type": "Action.ToggleVisibility",
				"targetElements": [
					"moreDetails",
					"fewerDetails",
					"opportunityDetails"
				]
			},
			"horizontalAlignment": "right",
			"items": [
				{
					"type": "TextBlock",
					"id": "moreDetails",
					"horizontalAlignment": "right",
					"color": "accent",
					"text": "More details"
				},
				{
					"type": "TextBlock",
					"id": "fewerDetails",
					"horizontalAlignment": "right",
					"spacing": "none",
					"color": "accent",
					"text": "Fewer details",
					"isVisible": false
				}
			]
		},
		{
			"type": "Container",
			"id": "opportunityDetails",
			"isVisible": false,
			"items": [
				{
					"type": "ColumnSet",
					"columns": [
						{
							"width": 1,
							"items": [
								{
									"type": "TextBlock",
									"text": "**Start date:**"
								},
								{
									"type": "Input.Date",
									"id": "startDate",
									"value": "2017-09-20"
								}
							]
						},
						{
							"width": 1,
							"items": [
								{
									"type": "TextBlock",
									"text": "**End date:**"
								},
								{
									"type": "Input.Date",
									"id": "endDate",
									"value": "2018-01-01"
								}
							]
						},
						{
							"width": 1,
							"items": [
								{
									"type": "TextBlock",
									"text": "**Amount:**"
								},
								{
									"type": "Input.Number",
									"id": "amount",
									"value": 1000000000
								}
							]
						}
					]
				}
			]
		},
		{
			"type": "ActionSet",
			"spacing": "medium",
			"actions": [
				{
					"type": "Action.Http",
					"id": "updateOpportunity",
					"title": "Update opportunity"
				},
				{
					"type": "Action.Http",
					"addInId": "abc",
					"desktopCommandId": "def",
					"title": "Manage tasks..."
				}
			]
		}
	],
	"actions": null,
	"type": "AdaptiveCard",
	"id": "427FB9DB-E2E6-4A26-B684-454D6B62A731",
	"correlationId": "5dc5fb4f-fef6-43dc-94d3-6ca90b0430d2",
	"originator": null,
	"hideOriginalBody": false,
	"enableBodyToggling": false,
	"expectedActors": null,
	"messageCardContext": {
		"correlationId": "5dc5fb4f-fef6-43dc-94d3-6ca90b0430d2",
		"messageCardSource": "AdaptiveCard",
		"oamAppName": null
	},
	"resources": null,
	"autoInvokeAction": null,
	"autoInvokeOptions": null,
	"speak": null,
	"title": null,
	"backgroundImage": null,
	"version": "1.0",
	"minVersion": null,
	"fallbackText": null,
	"theme": null
}
```

## Calendar
```
{
	"cardName": "Calendar",
	"body": [
		{
			"type": "ColumnSet",
			"horizontalAlignment": "center",
			"columns": [
				{
					"width": 1,
					"items": [
						{
							"type": "ColumnSet",
							"horizontalAlignment": "center",
							"columns": [
								{
									"width": "auto",
									"items": [
										{
											"type": "Image",
											"size": "auto",
											"url": "http://messagecardplayground.azurewebsites.net/assets/LocationGreen_A.png"
										}
									]
								},
								{
									"width": "auto",
									"items": [
										{
											"type": "TextBlock",
											"text": "**Redmond**"
										},
										{
											"type": "TextBlock",
											"spacing": "none",
											"text": "8a - 12:30p"
										}
									]
								}
							]
						}
					]
				},
				{
					"width": 1,
					"separator": true,
					"items": [
						{
							"type": "ColumnSet",
							"horizontalAlignment": "center",
							"columns": [
								{
									"width": "auto",
									"items": [
										{
											"type": "Image",
											"size": "auto",
											"url": "http://messagecardplayground.azurewebsites.net/assets/LocationBlue_B.png"
										}
									]
								},
								{
									"width": "auto",
									"items": [
										{
											"type": "TextBlock",
											"text": "**Bellevue**"
										},
										{
											"type": "TextBlock",
											"spacing": "none",
											"text": "12:30p - 3p"
										}
									]
								}
							]
						}
					]
				},
				{
					"width": 1,
					"separator": true,
					"items": [
						{
							"type": "ColumnSet",
							"horizontalAlignment": "center",
							"columns": [
								{
									"width": "auto",
									"items": [
										{
											"type": "Image",
											"size": "auto",
											"url": "http://messagecardplayground.azurewebsites.net/assets/LocationRed_C.png"
										}
									]
								},
								{
									"width": "auto",
									"items": [
										{
											"type": "TextBlock",
											"text": "**Seattle**"
										},
										{
											"type": "TextBlock",
											"spacing": "none",
											"text": "8p"
										}
									]
								}
							]
						}
					]
				}
			]
		},
		{
			"type": "Container",
			"selectAction": {
				"type": "Action.OpenUrl",
				"url": "http://www.microsoft.com"
			},
			"spacing": "extraLarge",
			"items": [
				{
					"type": "ColumnSet",
					"spacing": "extraLarge",
					"columns": [
						{
							"width": 5,
							"items": [
								{
									"type": "TextBlock",
									"text": "2:00 PM"
								},
								{
									"type": "TextBlock",
									"spacing": "none",
									"text": "1hr",
									"isSubtle": true
								},
								{
									"type": "Image",
									"spacing": "none",
									"url": "http://messagecardplayground.azurewebsites.net/assets/Conflict.png"
								}
							]
						},
						{
							"width": "auto",
							"spacing": "small",
							"items": [
								{
									"type": "Image",
									"horizontalAlignment": "center",
									"url": "http://messagecardplayground.azurewebsites.net/assets/CircleGreen_coffee.png"
								}
							]
						},
						{
							"width": 20,
							"spacing": "medium",
							"items": [
								{
									"type": "TextBlock",
									"text": "**Contoso Campaign Status Meeting**",
									"wrap": true
								},
								{
									"type": "ColumnSet",
									"columns": [
										{
											"width": "auto",
											"items": [
												{
													"type": "Image",
													"url": "http://messagecardplayground.azurewebsites.net/assets/location_gray.png"
												}
											]
										},
										{
											"width": "stretch",
											"items": [
												{
													"type": "TextBlock",
													"text": "Conf Room Bravern-2/9050",
													"wrap": true
												}
											]
										}
									]
								},
								{
									"type": "ImageSet",
									"imageSize": "small",
									"images": [
										{
											"url": "http://messagecardplayground.azurewebsites.net/assets/person_w1.png"
										},
										{
											"url": "http://messagecardplayground.azurewebsites.net/assets/person_m1.png"
										},
										{
											"url": "http://messagecardplayground.azurewebsites.net/assets/person_w2.png"
										},
										{
											"url": "http://messagecardplayground.azurewebsites.net/assets/person_m2.png"
										}
									]
								},
								{
									"type": "ColumnSet",
									"columns": [
										{
											"width": "auto",
											"items": [
												{
													"type": "Image",
													"url": "http://messagecardplayground.azurewebsites.net/assets/power_point.png"
												}
											]
										},
										{
											"width": "stretch",
											"items": [
												{
													"type": "TextBlock",
													"text": "**Contoso Brand Guidelines** shared by **Susan Metters**",
													"wrap": true
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{
					"type": "ColumnSet",
					"spacing": "medium",
					"columns": [
						{
							"width": 5
						},
						{
							"width": "auto",
							"spacing": "small",
							"items": [
								{
									"type": "Image",
									"horizontalAlignment": "center",
									"url": "http://messagecardplayground.azurewebsites.net/assets/Gray_Dot2.png"
								}
							]
						},
						{
							"width": 20,
							"spacing": "medium",
							"items": [
								{
									"type": "ColumnSet",
									"columns": [
										{
											"width": "auto",
											"items": [
												{
													"type": "Image",
													"url": "http://messagecardplayground.azurewebsites.net/assets/car.png"
												}
											]
										},
										{
											"width": "stretch",
											"items": [
												{
													"type": "TextBlock",
													"isSubtle": true,
													"text": "about 45 minutes",
													"wrap": true
												}
											]
										}
									]
								}
							]
						}
					]
				}
			]
		},
		{
			"type": "Container",
			"selectAction": {
				"type": "Action.OpenUrl",
				"url": "http://www.microsoft.com"
			},
			"spacing": "medium",
			"items": [
				{
					"type": "ColumnSet",
					"columns": [
						{
							"width": 5,
							"items": [
								{
									"type": "TextBlock",
									"text": "8:00 PM"
								},
								{
									"type": "TextBlock",
									"spacing": "none",
									"text": "1hr",
									"isSubtle": true
								}
							]
						},
						{
							"width": "auto",
							"spacing": "small",
							"items": [
								{
									"type": "Image",
									"horizontalAlignment": "center",
									"url": "http://messagecardplayground.azurewebsites.net/assets/CircleBlue_flight.png"
								}
							]
						},
						{
							"width": 20,
							"spacing": "medium",
							"items": [
								{
									"type": "TextBlock",
									"text": "**Alaska Airlines AS1021 flight to Chicago**",
									"wrap": true
								},
								{
									"type": "ColumnSet",
									"separation": "none",
									"columns": [
										{
											"size": "auto",
											"items": [
												{
													"type": "Image",
													"url": "http://messagecardplayground.azurewebsites.net/assets/location_gray.png"
												}
											]
										},
										{
											"size": "stretch",
											"items": [
												{
													"type": "TextBlock",
													"wrap": true,
													"text": "Seattle Tacoma International Airport (17801 International Blvd, Seattle, WA, United States)"
												}
											]
										}
									]
								},
								{
									"type": "Image",
									"size": "stretch",
									"url": "http://messagecardplayground.azurewebsites.net/assets/SeaTacMap.png"
								}
							]
						}
					]
				}
			]
		}
	],
	"actions": null,
	"type": "AdaptiveCard",
	"id": "427FB9DB-E2E6-4A26-B684-454D6B62A731",
	"correlationId": "7724ce9b-fda7-4195-9a81-ed2f48ebcae8",
	"originator": null,
	"hideOriginalBody": false,
	"enableBodyToggling": false,
	"expectedActors": null,
	"messageCardContext": {
		"correlationId": "7724ce9b-fda7-4195-9a81-ed2f48ebcae8",
		"messageCardSource": "AdaptiveCard",
		"oamAppName": null
	},
	"resources": null,
	"autoInvokeAction": null,
	"autoInvokeOptions": null,
	"speak": null,
	"title": null,
	"backgroundImage": null,
	"version": "1.0",
	"minVersion": null,
	"fallbackText": null,
	"theme": null
}
```
