#!/bin/bash

# 获取用户空间占用CPU百分比
cpu_user=$(top -b -n 1 | grep Cpu | awk '{print $2}' | cut -f 1 -d "%")
# 获取内核空间占用CPU百分比
cpu_system=$(top -b -n 1 | grep Cpu | awk '{print $4}' | cut -f 1 -d "%")

echo "{\"cpu_usr\":$cpu_user,\"cpu_sys\":$cpu_system}"
