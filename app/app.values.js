(function () {
	'use strict';

	angular
		.module('youproductiveApp')
		.value('dt', {
			options: {
				priority: [
					{name: 'High', theme: 'priority-high'},
					{name: 'Normal', theme: 'priority-normal'},
					{name: 'Low', theme: 'priority-low'}
				]
			},
			active: {
				inbox: {proper: 'inbox', active: true},
				starred: {proper: 'inbox', active: false},
				priorities: {proper: 'inbox', active: false},
				duedate: {proper: 'inbox', active: false},
				recentlyadded: {proper: 'inbox', active: false},
				completed: {proper: 'inbox', active: false}
			},
			lists: {
				task: [
					{name: 'inbox', proper: 'inbox', active: true},
					{name: 'starred', proper: 'starred', active: false},
					{name: 'priorities', proper: 'priorities', active: false},
					{name: 'duedate', proper: 'due date', active: false},
					{name: 'recentlyadded', proper: 'recently added', active: false},
					{name: 'completed', proper: 'completed', active: false}
				],
				sub: [
					{name: 'taskDetails', proper: 'task detail', active: true},
					{name: 'subTasks', proper: 'subtask', active: false},
					{name: 'notes', proper: 'note', active: false},
					{name: 'comments', proper: 'comment', active: false},
					{name: 'files', proper: 'file', active: false},
					{name: 'assign', proper: 'assign', active: false},
					{name: 'share', proper: 'share', active: false}
				]
			},
			repeat: [
				'No repeat',
				'Every day',
				'Every week',
				'Every 2 weeks',
				'Every month',
				'Every 2 months',
				'Every 3 months',
				'Every 6 months',
				'Every year'
			],
			repeat_from: [
				'Completion date',
				'Due date',
				'No repeat'
			]
		})
})();