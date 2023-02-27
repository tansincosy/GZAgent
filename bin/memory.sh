#!/bin/bash

# 获取物理内存总量
mem_total=$(free | grep Mem | awk '{print $2}')
# 获取操作系统已使用内存总量
mem_sys_used=$(free | grep Mem | awk '{print $3}')
echo "{\"total\":$mem_total,\"usage\":$mem_sys_used}"
