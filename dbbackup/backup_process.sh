#!/bin/sh
if [ $1 = backup ]
then
	cd $2/	
	mysqldump -h $2 -u $3 -p$4 $5 > $6
